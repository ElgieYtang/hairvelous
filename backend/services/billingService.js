const pool = require('../config/db');
const notificationService = require('./notificationService');

class BillingService {
  constructor() {
    this.schemaReady = false;
  }

  /**
   * Core DIY guides table (matches schema_hairvelous + columns used by guideService).
   * Some databases were created without this table; CREATE IF NOT EXISTS fixes empty installs.
   */
  async ensureDiyGuidesTable() {
    if (process.env.SKIP_DB_FOR_TESTING === 'true') return;
    await pool.query(`
      CREATE TABLE IF NOT EXISTS diy_guides (
        guide_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        category ENUM('mask', 'oil', 'rinse', 'growth') NOT NULL DEFAULT 'mask',
        difficulty ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'easy',
        ingredients TEXT NULL,
        steps TEXT NOT NULL,
        caution TEXT NULL,
        created_by INT NULL,
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_pro_only TINYINT(1) NOT NULL DEFAULT 0,
        summary TEXT NULL,
        INDEX idx_category (category),
        INDEX idx_difficulty (difficulty),
        INDEX idx_created_by (created_by),
        INDEX idx_date_created (date_created),
        CONSTRAINT fk_guide_creator FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  /**
   * Seed sample guides when the table is empty (first deploy / missing seed).
   */
  async seedDiyGuidesIfEmpty() {
    if (process.env.SKIP_DB_FOR_TESTING === 'true') return;
    try {
      const [[{ c }]] = await pool.query('SELECT COUNT(*) AS c FROM diy_guides');
      if (Number(c) > 0) return;
      const rows = [
        ['Coconut Oil Hair Mask', 'mask', 'easy', '2 tbsp coconut oil, 1 tbsp honey (optional)', '1. Warm coconut oil slightly\n2. Apply to hair lengths and ends\n3. Leave for 30 minutes\n4. Wash with mild shampoo', 'Do not use if allergic to coconut. Patch test first.', null],
        ['Apple Cider Vinegar Rinse', 'rinse', 'easy', '1 part ACV, 4 parts water', '1. Mix ACV with water\n2. After shampooing, pour over hair\n3. Massage scalp gently\n4. Rinse thoroughly', 'Do not use if you have open cuts or severe scalp issues. Consult a professional if unsure.', null],
        ['Argan Oil Treatment', 'oil', 'easy', '2-3 drops argan oil', '1. Apply oil to palms\n2. Work through damp hair\n3. Focus on ends\n4. Style as usual', 'Use sparingly to avoid greasy look.', null],
        ['Egg and Olive Oil Mask', 'mask', 'medium', '1 egg, 2 tbsp olive oil', '1. Beat egg and mix with olive oil\n2. Apply to hair\n3. Cover with shower cap\n4. Leave 20 minutes\n5. Rinse with cool water', 'Use cool water to rinse to avoid cooking the egg. May have strong smell.', null],
        ['Rice Water Rinse for Growth', 'rinse', 'easy', '1 cup rice, 2 cups water', '1. Soak rice in water for 30 minutes\n2. Strain and collect water\n3. After shampoo, pour rice water over hair\n4. Massage and leave 5 minutes\n5. Rinse', 'Fermented rice water may have stronger effect but stronger smell. Start with fresh rice water.', null],
      ];
      await pool.query(
        'INSERT INTO diy_guides (title, category, difficulty, ingredients, steps, caution, created_by) VALUES ?',
        [rows]
      );
    } catch (e) {
      console.warn('[billingService] seedDiyGuidesIfEmpty:', e.message);
    }
  }

  /**
   * Hairvelous `diy_guides` may omit columns that older SQL or seeds expect (`is_pro_only`, `summary`).
   * Uses INFORMATION_SCHEMA so we only ALTER when needed (works across MySQL/MariaDB duplicate rules).
   */
  async ensureDiyGuidesAddonColumns() {
    if (process.env.SKIP_DB_FOR_TESTING === 'true') return;
    try {
      await this.ensureDiyGuidesTable();

      const [colRows] = await pool.query(
        `SELECT LOWER(COLUMN_NAME) AS name FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'diy_guides'`
      );
      const have = new Set(colRows.map((r) => r.name));

      if (!have.has('is_pro_only')) {
        await pool.query(
          'ALTER TABLE diy_guides ADD COLUMN is_pro_only TINYINT(1) NOT NULL DEFAULT 0'
        );
      }
      if (!have.has('summary')) {
        await pool.query('ALTER TABLE diy_guides ADD COLUMN summary TEXT NULL');
      }

      await this.seedDiyGuidesIfEmpty();
    } catch (e) {
      console.warn('[billingService] ensureDiyGuidesAddonColumns:', e.message);
    }
  }

  async ensurePaymentTransactionColumns() {
    const [colRows] = await pool.query(
      `SELECT LOWER(COLUMN_NAME) AS name FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'payment_transactions'`
    );
    const have = new Set(colRows.map((r) => r.name));
    if (!have.has('card_name')) {
      await pool.query('ALTER TABLE payment_transactions ADD COLUMN card_name VARCHAR(150) NULL');
    }
    if (!have.has('card_last4')) {
      await pool.query('ALTER TABLE payment_transactions ADD COLUMN card_last4 VARCHAR(4) NULL');
    }
    if (!have.has('card_reference')) {
      await pool.query('ALTER TABLE payment_transactions ADD COLUMN card_reference VARCHAR(100) NULL');
    }
  }

  async ensureSchema() {
    await this.ensureDiyGuidesAddonColumns();
    if (this.schemaReady) return;
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscription_plans (
        plan_id INT PRIMARY KEY AUTO_INCREMENT,
        plan_code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(120) NOT NULL,
        price_php DECIMAL(10,2) NOT NULL DEFAULT 0,
        duration_days INT NOT NULL DEFAULT 30,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_subscriptions (
        subscription_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        plan_id INT NOT NULL,
        status ENUM('active','expired','cancelled') NOT NULL DEFAULT 'active',
        starts_at DATETIME NOT NULL,
        ends_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_sub_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        CONSTRAINT fk_sub_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id) ON DELETE RESTRICT
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_transactions (
        payment_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        plan_id INT NOT NULL,
        method ENUM('gcash','card') NOT NULL DEFAULT 'gcash',
        amount_php DECIMAL(10,2) NOT NULL DEFAULT 0,
        gcash_name VARCHAR(150) NULL,
        gcash_number VARCHAR(30) NULL,
        gcash_reference VARCHAR(100) NULL,
        card_name VARCHAR(150) NULL,
        card_last4 VARCHAR(4) NULL,
        card_reference VARCHAR(100) NULL,
        receipt_path VARCHAR(500) NULL,
        status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
        admin_note TEXT NULL,
        reviewed_by INT NULL,
        reviewed_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        CONSTRAINT fk_payment_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id) ON DELETE RESTRICT,
        CONSTRAINT fk_payment_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL
      )
    `);
    await pool.query("ALTER TABLE payment_transactions MODIFY COLUMN method ENUM('gcash','card') NOT NULL DEFAULT 'gcash'");
    await this.ensurePaymentTransactionColumns();

    const [plans] = await pool.query('SELECT plan_code FROM subscription_plans');
    const codes = new Set(plans.map((p) => p.plan_code));
    if (!codes.has('free')) {
      await pool.query(
        "INSERT INTO subscription_plans (plan_code, name, price_php, duration_days, is_active) VALUES ('free','Free',0,3650,1)"
      );
    }
    if (!codes.has('pro_monthly')) {
      await pool.query(
        "INSERT INTO subscription_plans (plan_code, name, price_php, duration_days, is_active) VALUES ('pro_monthly','Pro Monthly',199,30,1)"
      );
    }
    this.schemaReady = true;
  }

  async listPlans() {
    await this.ensureSchema();
    const [rows] = await pool.query(
      'SELECT plan_id, plan_code, name, price_php, duration_days FROM subscription_plans WHERE is_active = 1 ORDER BY price_php ASC'
    );
    return rows.map((r) => ({
      planId: r.plan_id,
      planCode: r.plan_code,
      name: r.name,
      pricePhp: Number(r.price_php),
      durationDays: r.duration_days,
    }));
  }

  async getStatus(userId) {
    await this.ensureSchema();
    const [subRows] = await pool.query(
      `SELECT us.subscription_id, us.status, us.starts_at, us.ends_at, sp.plan_code, sp.name
       FROM user_subscriptions us
       JOIN subscription_plans sp ON sp.plan_id = us.plan_id
       WHERE us.user_id = ? AND us.status = 'active' AND us.ends_at >= NOW()
       ORDER BY us.ends_at DESC
       LIMIT 1`,
      [userId]
    );
    const [pendingRows] = await pool.query(
      `SELECT payment_id, method, amount_php, gcash_reference, created_at
       FROM payment_transactions
       WHERE user_id = ? AND status = 'pending'
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );
    const active = subRows[0] || null;
    const isPro = !!(active && active.plan_code !== 'free');
    return {
      tier: active ? active.plan_code : 'free',
      planName: active ? active.name : 'Free',
      isPro,
      entitlements: this.getEntitlementsFromIsPro(isPro),
      activeUntil: active ? active.ends_at : null,
      pendingPayment: pendingRows[0]
        ? {
            paymentId: pendingRows[0].payment_id,
            method: pendingRows[0].method,
            amountPhp: Number(pendingRows[0].amount_php),
            gcashReference: pendingRows[0].gcash_reference,
            createdAt: pendingRows[0].created_at,
          }
        : null,
    };
  }

  getEntitlementsFromIsPro(isPro) {
    return {
      maxActiveConsultations: isPro ? 3 : 1,
      routineHistoryDays: isPro ? null : 30,
      routineMediaUpload: isPro ? 'image_video' : 'image_only',
      canUploadRoutineVideo: !!isPro,
      advancedAnalytics: !!isPro,
      smartReminders: !!isPro,
      premiumGuides: !!isPro,
      priorityConsultationQueue: !!isPro,
    };
  }

  async getEntitlements(userId) {
    const status = await this.getStatus(userId);
    return status.entitlements || this.getEntitlementsFromIsPro(!!status.isPro);
  }

  async isUserPro(userId) {
    await this.ensureSchema();
    const [rows] = await pool.query(
      `SELECT us.subscription_id
       FROM user_subscriptions us
       JOIN subscription_plans sp ON sp.plan_id = us.plan_id
       WHERE us.user_id = ? AND us.status = 'active' AND us.ends_at >= NOW() AND sp.plan_code <> 'free'
       LIMIT 1`,
      [userId]
    );
    return rows.length > 0;
  }

  async submitGcashPayment(userId, payload, receiptPath) {
    await this.ensureSchema();
    const { planCode, gcashName, gcashNumber, gcashReference } = payload;
    if (!planCode || !gcashName || !gcashNumber || !gcashReference) {
      throw new Error('Missing payment fields');
    }
    const [planRows] = await pool.query(
      'SELECT plan_id, price_php FROM subscription_plans WHERE plan_code = ? AND is_active = 1 LIMIT 1',
      [planCode]
    );
    if (!planRows.length) throw new Error('Invalid plan');
    const plan = planRows[0];
    const [result] = await pool.query(
      `INSERT INTO payment_transactions
         (user_id, plan_id, method, amount_php, gcash_name, gcash_number, gcash_reference, receipt_path, status)
       VALUES (?, ?, 'gcash', ?, ?, ?, ?, ?, 'pending')`,
      [
        userId,
        plan.plan_id,
        Number(plan.price_php),
        gcashName.trim(),
        gcashNumber.trim(),
        gcashReference.trim(),
        receiptPath || null,
      ]
    );
    return { paymentId: result.insertId, status: 'pending' };
  }

  async submitCardPayment(userId, payload, receiptPath) {
    await this.ensureSchema();
    const { planCode, cardName, cardLast4, cardReference } = payload;
    if (!planCode || !cardName || !cardLast4 || !cardReference) {
      throw new Error('Missing card payment fields');
    }
    const [planRows] = await pool.query(
      'SELECT plan_id, price_php FROM subscription_plans WHERE plan_code = ? AND is_active = 1 LIMIT 1',
      [planCode]
    );
    if (!planRows.length) throw new Error('Invalid plan');
    const plan = planRows[0];
    const [result] = await pool.query(
      `INSERT INTO payment_transactions
         (user_id, plan_id, method, amount_php, card_name, card_last4, card_reference, receipt_path, status)
       VALUES (?, ?, 'card', ?, ?, ?, ?, ?, 'pending')`,
      [userId, plan.plan_id, Number(plan.price_php), cardName.trim(), String(cardLast4).trim().slice(-4), cardReference.trim(), receiptPath || null]
    );
    return { paymentId: result.insertId, status: 'pending' };
  }

  async activateProDirect(userId) {
    await this.ensureSchema();
    const [planRows] = await pool.query(
      `SELECT plan_id, plan_code, duration_days
       FROM subscription_plans
       WHERE is_active = 1 AND plan_code IN ('pro', 'pro_monthly')
       ORDER BY CASE WHEN plan_code = 'pro_monthly' THEN 0 ELSE 1 END
       LIMIT 1`
    );
    if (!planRows.length) {
      throw new Error('Pro plan is not available');
    }
    const plan = planRows[0];
    await pool.query(
      "UPDATE user_subscriptions SET status = 'expired' WHERE user_id = ? AND status = 'active'",
      [userId]
    );
    await pool.query(
      `INSERT INTO user_subscriptions (user_id, plan_id, status, starts_at, ends_at)
       VALUES (?, ?, 'active', NOW(), DATE_ADD(NOW(), INTERVAL ? DAY))`,
      [userId, plan.plan_id, plan.duration_days]
    );
    await notificationService.createForUser(userId, {
      type: 'plan_change',
      title: 'Pro plan activated',
      message: 'Your Pro plan is now active.',
      linkUrl: '/pricing.html',
    });
    return { activated: true, planCode: plan.plan_code };
  }

  async activateFreeDirect(userId) {
    await this.ensureSchema();
    const [planRows] = await pool.query(
      `SELECT plan_id, plan_code, duration_days
       FROM subscription_plans
       WHERE is_active = 1 AND plan_code = 'free'
       LIMIT 1`
    );
    if (!planRows.length) {
      throw new Error('Free plan is not available');
    }
    const plan = planRows[0];
    await pool.query(
      "UPDATE user_subscriptions SET status = 'expired' WHERE user_id = ? AND status = 'active'",
      [userId]
    );
    await pool.query(
      `INSERT INTO user_subscriptions (user_id, plan_id, status, starts_at, ends_at)
       VALUES (?, ?, 'active', NOW(), DATE_ADD(NOW(), INTERVAL ? DAY))`,
      [userId, plan.plan_id, plan.duration_days]
    );
    await notificationService.createForUser(userId, {
      type: 'plan_change',
      title: 'Free plan activated',
      message: 'Your plan is now set to Free.',
      linkUrl: '/pricing.html',
    });
    return { activated: true, planCode: plan.plan_code };
  }

  async listPayments(status = null) {
    await this.ensureSchema();
    const [rows] = await pool.query(
      `SELECT pt.payment_id, pt.user_id, u.name, u.email, sp.plan_code, sp.name AS plan_name,
              pt.amount_php, pt.method, pt.gcash_name, pt.gcash_number, pt.gcash_reference,
              pt.card_name, pt.card_last4, pt.card_reference,
              pt.receipt_path, pt.status, pt.admin_note, pt.created_at, pt.reviewed_at
       FROM payment_transactions pt
       JOIN users u ON u.user_id = pt.user_id
       JOIN subscription_plans sp ON sp.plan_id = pt.plan_id
       WHERE (? IS NULL OR pt.status = ?)
       ORDER BY pt.created_at DESC`,
      [status, status]
    );
    return rows.map((r) => ({
      paymentId: r.payment_id,
      userId: r.user_id,
      userName: r.name,
      email: r.email,
      planCode: r.plan_code,
      planName: r.plan_name,
      amountPhp: Number(r.amount_php),
      method: r.method,
      gcashName: r.gcash_name,
      gcashNumber: r.gcash_number,
      gcashReference: r.gcash_reference,
      cardName: r.card_name,
      cardLast4: r.card_last4,
      cardReference: r.card_reference,
      receiptPath: r.receipt_path ? `/${String(r.receipt_path).replace(/\\/g, '/')}` : null,
      status: r.status,
      adminNote: r.admin_note,
      createdAt: r.created_at,
      reviewedAt: r.reviewed_at,
    }));
  }

  async reviewPayment(adminUserId, paymentId, action, adminNote = null) {
    await this.ensureSchema();
    const id = Number(paymentId);
    if (!Number.isFinite(id)) throw new Error('Invalid payment ID');
    const [rows] = await pool.query(
      `SELECT payment_id, user_id, plan_id, status
       FROM payment_transactions
       WHERE payment_id = ?`,
      [id]
    );
    if (!rows.length) throw new Error('Payment not found');
    if (rows[0].status !== 'pending') throw new Error('Payment already reviewed');

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    await pool.query(
      `UPDATE payment_transactions
       SET status = ?, admin_note = ?, reviewed_by = ?, reviewed_at = NOW()
       WHERE payment_id = ?`,
      [newStatus, adminNote || null, adminUserId, id]
    );

    if (newStatus === 'approved') {
      const [planRows] = await pool.query(
        'SELECT duration_days, plan_code FROM subscription_plans WHERE plan_id = ? LIMIT 1',
        [rows[0].plan_id]
      );
      if (!planRows.length) throw new Error('Plan missing');
      const plan = planRows[0];
      await pool.query(
        "UPDATE user_subscriptions SET status = 'expired' WHERE user_id = ? AND status = 'active'",
        [rows[0].user_id]
      );
      await pool.query(
        `INSERT INTO user_subscriptions (user_id, plan_id, status, starts_at, ends_at)
         VALUES (?, ?, 'active', NOW(), DATE_ADD(NOW(), INTERVAL ? DAY))`,
        [rows[0].user_id, rows[0].plan_id, plan.duration_days]
      );
      await notificationService.createForUser(rows[0].user_id, {
        type: 'payment_update',
        title: 'Payment approved',
        message: `Your payment was approved and ${plan.plan_code} is now active.`,
        linkUrl: '/pricing.html',
      });
      return { paymentId: id, status: 'approved', planCode: plan.plan_code };
    }
    await notificationService.createForUser(rows[0].user_id, {
      type: 'payment_update',
      title: 'Payment rejected',
      message: 'Your payment was rejected. Please review billing details.',
      linkUrl: '/pricing.html',
    });
    return { paymentId: id, status: 'rejected' };
  }

  async getProgressReport(userId) {
    await this.ensureSchema();
    const status = await this.getStatus(userId);
    const [profileRows] = await pool.query(
      'SELECT hair_type, scalp_condition, issues_detected, last_updated FROM hair_profiles WHERE user_id = ? ORDER BY last_updated DESC LIMIT 1',
      [userId]
    );
    const [routineRows] = await pool.query(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN date_logged >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS last30
       FROM routine_logs WHERE user_id = ?`,
      [userId]
    );
    const [recRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM recommendations
       WHERE user_id = ?`,
      [userId]
    );
    const profile = profileRows[0] || null;
    return {
      generatedAt: new Date().toISOString(),
      subscription: status,
      profile: profile
        ? {
            hairType: profile.hair_type,
            scalpCondition: profile.scalp_condition,
            issuesDetected: profile.issues_detected,
            lastUpdated: profile.last_updated,
          }
        : null,
      routine: {
        totalLogs: Number((routineRows[0] && routineRows[0].total) || 0),
        logsLast30Days: Number((routineRows[0] && routineRows[0].last30) || 0),
      },
      recommendations: {
        totalRecommended: Number((recRows[0] && recRows[0].total) || 0),
      },
    };
  }
}

module.exports = new BillingService();
