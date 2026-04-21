/**
 * Profile Service
 * Location: backend/services/profileService.js
 * Purpose: Business logic for user profiles (basic details, photo, credentials)
 */
const path = require('path');
const fs = require('fs').promises;
const pool = require('../config/db');

function detectFileKindFromSignature(buf) {
  if (!buf || buf.length < 12) return null;
  // PDF: %PDF
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) return 'pdf';
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return 'png';
  }
  // GIF: GIF87a / GIF89a
  if (
    buf[0] === 0x47 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x38 &&
    (buf[4] === 0x37 || buf[4] === 0x39) &&
    buf[5] === 0x61
  ) {
    return 'gif';
  }
  // WEBP: RIFF....WEBP
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return 'webp';
  }
  return null;
}

async function validateCredentialFile(savedPath, originalName) {
  const ext = path.extname(String(originalName || '')).slice(1).toLowerCase();
  const normalizedExt = ext === 'jpeg' ? 'jpg' : ext;
  const allowedExt = new Set(['pdf', 'jpg', 'png', 'gif', 'webp']);
  if (!allowedExt.has(normalizedExt)) {
    throw new Error(`"${originalName}" is not an accepted ID document type`);
  }

  const stats = await fs.stat(savedPath);
  // Very tiny files are commonly invalid/truncated uploads.
  if (!stats || stats.size < 2048) {
    throw new Error(`"${originalName}" looks too small to be a valid ID document`);
  }

  const fd = await fs.open(savedPath, 'r');
  try {
    const header = Buffer.alloc(32);
    await fd.read(header, 0, 32, 0);
    const kind = detectFileKindFromSignature(header);
    if (!kind) {
      throw new Error(`"${originalName}" failed file integrity check`);
    }
    if (kind !== normalizedExt) {
      throw new Error(`"${originalName}" extension does not match its actual file format`);
    }
  } finally {
    await fd.close();
  }
}

function parseJsonSafe(str) {
  if (!str) return null;
  try {
    const v = JSON.parse(str);
    return Array.isArray(v) ? v : (typeof v === 'object' ? v : null);
  } catch (_e) {
    return null;
  }
}

class ProfileService {
  async ensureProfileColumns() {
    const tryAlter = async (sql) => {
      try {
        await pool.query(sql);
      } catch (e) {
        const code = e && (e.code || e.errno);
        if (code === 'ER_DUP_FIELDNAME' || code === 1060) return;
        throw e;
      }
    };

    await tryAlter('ALTER TABLE user_profiles ADD COLUMN specialty VARCHAR(120) NULL');
    await tryAlter('ALTER TABLE user_profiles ADD COLUMN location VARCHAR(180) NULL');
    await tryAlter('ALTER TABLE user_profiles ADD COLUMN consultation_rate DECIMAL(10,2) NULL');
    await tryAlter('ALTER TABLE user_profiles ADD COLUMN profile_photo_path VARCHAR(255) NULL');
    await tryAlter('ALTER TABLE user_profiles ADD COLUMN expertise_json JSON NULL');
    await tryAlter('ALTER TABLE user_profiles ADD COLUMN skills_json JSON NULL');
    await tryAlter('ALTER TABLE user_profiles ADD COLUMN education_json JSON NULL');
    await tryAlter('ALTER TABLE user_profiles ADD COLUMN sex VARCHAR(32) NULL');
    await tryAlter('ALTER TABLE user_profiles ADD COLUMN birthdate DATE NULL');
    await tryAlter('ALTER TABLE user_profiles ADD COLUMN race VARCHAR(120) NULL');
    await tryAlter("ALTER TABLE user_profiles ADD COLUMN id_verification_status VARCHAR(24) NULL DEFAULT 'not_submitted'");
    await tryAlter(
      'ALTER TABLE user_profiles ADD COLUMN share_routine_with_specialist TINYINT(1) NOT NULL DEFAULT 0'
    );
  }

  /**
   * Get user profile (users + user_profiles + hair_profiles + credential docs)
   */
  async getProfile(userId) {
    await this.ensureProfileColumns();
    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.email, u.date_created, r.role_name,
              hp.hair_type, hp.scalp_condition, hp.issues_detected, hp.last_updated,
              up.profile_photo_path, up.specialty, up.location, up.consultation_rate,
              up.expertise_json, up.skills_json, up.education_json,
              up.sex, up.birthdate, up.race, up.id_verification_status,
              up.share_routine_with_specialist
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       LEFT JOIN hair_profiles hp ON u.user_id = hp.user_id
       LEFT JOIN user_profiles up ON u.user_id = up.user_id
       WHERE u.user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      throw new Error('User not found');
    }

    const user = rows[0];
    const [docRows] = await pool.query(
      'SELECT id, file_path, original_name, uploaded_at FROM user_credential_documents WHERE user_id = ? ORDER BY uploaded_at DESC',
      [userId]
    );

    const toUrl = (p) => (p ? '/' + p.replace(/\\/g, '/') : null);

    return {
      userId: user.user_id,
      name: user.name,
      email: user.email,
      roleName: user.role_name,
      dateCreated: user.date_created,
      profilePhotoUrl: toUrl(user.profile_photo_path),
      specialty: user.specialty || null,
      location: user.location || null,
      consultationRate: user.consultation_rate != null ? Number(user.consultation_rate) : null,
      sex: user.sex || null,
      birthdate: user.birthdate || null,
      race: user.race || null,
      idVerificationStatus: user.id_verification_status || null,
      shareRoutineWithSpecialist: Number(user.share_routine_with_specialist) === 1,
      expertise: parseJsonSafe(user.expertise_json) || [],
      skills: parseJsonSafe(user.skills_json) || [],
      education: parseJsonSafe(user.education_json) || [],
      credentialDocuments: docRows.map(d => ({
        id: d.id,
        filePath: toUrl(d.file_path),
        originalName: d.original_name,
        uploadedAt: d.uploaded_at,
      })),
      hairProfile: user.hair_type ? {
        hairType: user.hair_type,
        scalpCondition: user.scalp_condition,
        issuesDetected: user.issues_detected,
        lastUpdated: user.last_updated,
      } : null,
    };
  }

  /**
   * Update user profile (users + user_profiles)
   */
  async updateProfile(userId, updates) {
    await this.ensureProfileColumns();
    const userAllowed = ['name', 'email'];
    const profileAllowed = ['specialty', 'location', 'consultation_rate', 'expertise', 'skills', 'education', 'sex', 'birthdate', 'race'];
    const userFields = [];
    const userValues = [];
    const profileFields = [];
    const profileValues = [];

    // Users table fields
    for (const field of userAllowed) {
      if (updates[field] !== undefined) {
        userFields.push(`${field} = ?`);
        userValues.push(updates[field]);
      }
    }

    // Check email uniqueness if updating email
    if (updates.email) {
      const [existing] = await pool.query(
        'SELECT user_id FROM users WHERE email = ? AND user_id != ?',
        [updates.email, userId]
      );
      if (existing.length > 0) throw new Error('Email already in use');
    }

    // Map consultationRate alias to consultation_rate column
    const rate = updates.consultation_rate !== undefined ? updates.consultation_rate : updates.consultationRate;
    if (rate !== undefined) {
      profileFields.push('consultation_rate = ?');
      profileValues.push(rate);
    }

    const shareRaw =
      updates.share_routine_with_specialist !== undefined
        ? updates.share_routine_with_specialist
        : updates.shareRoutineWithSpecialist;
    if (shareRaw !== undefined) {
      profileFields.push('share_routine_with_specialist = ?');
      profileValues.push(shareRaw === true || shareRaw === 1 || shareRaw === '1' ? 1 : 0);
    }

    // Profile fields (including sex, birthdate, race and JSON fields)
    for (const field of ['specialty', 'location', 'expertise', 'skills', 'education', 'sex', 'birthdate', 'race']) {
      if (updates[field] === undefined) continue;
      const col =
        field === 'expertise' ? 'expertise_json' :
        field === 'skills' ? 'skills_json' :
        field === 'education' ? 'education_json' :
        field;

      profileFields.push(`${col} = ?`);
      profileValues.push(
        field === 'expertise' || field === 'skills' || field === 'education'
          ? JSON.stringify(Array.isArray(updates[field]) ? updates[field] : [])
          : updates[field]
      );
    }

    if (userFields.length > 0) {
      userValues.push(userId);
      await pool.query(`UPDATE users SET ${userFields.join(', ')} WHERE user_id = ?`, userValues);
    }

    if (profileFields.length > 0) {
      const [exists] = await pool.query('SELECT user_id FROM user_profiles WHERE user_id = ?', [userId]);
      const cols = profileFields.map(f => f.replace(' = ?', ''));
      if (exists.length === 0) {
        await pool.query(
          'INSERT INTO user_profiles (user_id, ' + cols.join(', ') + ') VALUES (?, ' + profileValues.map(() => '?').join(', ') + ')',
          [userId, ...profileValues]
        );
      } else {
        profileValues.push(userId);
        await pool.query('UPDATE user_profiles SET ' + profileFields.join(', ') + ' WHERE user_id = ?', profileValues);
      }
    }

    if (userFields.length === 0 && profileFields.length === 0) {
      throw new Error('No fields to update');
    }

    return this.getProfile(userId);
  }

  /**
   * Set or replace profile photo
   */
  async setProfilePhoto(userId, filePath) {
    const relativePath = path
      .relative(path.join(__dirname, '..', '..'), filePath)
      .replace(/\\/g, '/');
    const [exists] = await pool.query('SELECT user_id, profile_photo_path FROM user_profiles WHERE user_id = ?', [userId]);
    if (exists.length > 0 && exists[0].profile_photo_path) {
      const oldPath = path.join(__dirname, '..', '..', exists[0].profile_photo_path);
      try { await fs.unlink(oldPath); } catch (_) {}
    }
    if (exists.length === 0) {
      await pool.query('INSERT INTO user_profiles (user_id, profile_photo_path) VALUES (?, ?)', [userId, relativePath]);
    } else {
      await pool.query('UPDATE user_profiles SET profile_photo_path = ? WHERE user_id = ?', [relativePath, userId]);
    }
    return this.getProfile(userId);
  }

  /**
   * Add credential document(s)
   */
  async addCredentialDocuments(userId, files) {
    for (const f of files) {
      try {
        await validateCredentialFile(f.path, f.originalname);
      } catch (err) {
        try { await fs.unlink(f.path); } catch (_) {}
        throw err;
      }
      const relativePath = path
        .relative(path.join(__dirname, '..', '..'), f.path)
        .replace(/\\/g, '/');
      await pool.query(
        'INSERT INTO user_credential_documents (user_id, file_path, original_name) VALUES (?, ?, ?)',
        [userId, relativePath, f.originalname || path.basename(f.path)]
      );
    }
    await pool.query(
      `INSERT INTO user_profiles (user_id, id_verification_status)
       VALUES (?, 'not_submitted')
       ON DUPLICATE KEY UPDATE id_verification_status =
         CASE
           WHEN id_verification_status IN ('verified', 'pending_review') THEN id_verification_status
           ELSE 'not_submitted'
         END`,
      [userId]
    );
    return this.getProfile(userId);
  }

  /**
   * Delete credential document
   */
  async deleteCredentialDocument(userId, docId) {
    const [rows] = await pool.query(
      'SELECT id, file_path FROM user_credential_documents WHERE id = ? AND user_id = ?',
      [docId, userId]
    );
    if (rows.length === 0) throw new Error('Document not found');
    const fullPath = path.join(__dirname, '..', '..', rows[0].file_path);
    try { await fs.unlink(fullPath); } catch (_) {}
    await pool.query('DELETE FROM user_credential_documents WHERE id = ?', [docId]);
    const [leftRows] = await pool.query(
      'SELECT COUNT(*) AS total FROM user_credential_documents WHERE user_id = ?',
      [userId]
    );
    const left = Number((leftRows && leftRows[0] && leftRows[0].total) || 0);
    if (left === 0) {
      await pool.query(
        `INSERT INTO user_profiles (user_id, id_verification_status)
         VALUES (?, 'not_submitted')
         ON DUPLICATE KEY UPDATE id_verification_status = 'not_submitted'`,
        [userId]
      );
    }
    return { deleted: true };
  }

  async submitIdVerification(userId) {
    await this.ensureProfileColumns();
    const [rows] = await pool.query('SELECT role_id FROM users WHERE user_id = ? LIMIT 1', [userId]);
    if (!rows.length) throw new Error('User not found');

    const [roleRows] = await pool.query('SELECT role_name FROM roles WHERE role_id = ? LIMIT 1', [rows[0].role_id]);
    const roleName = roleRows[0] && roleRows[0].role_name;
    if (roleName !== 'specialist') throw new Error('Only specialists can submit ID verification');

    const [docRows] = await pool.query(
      'SELECT COUNT(*) AS total FROM user_credential_documents WHERE user_id = ?',
      [userId]
    );
    const total = Number((docRows && docRows[0] && docRows[0].total) || 0);
    if (total < 1) throw new Error('Upload at least one valid ID document before submitting');

    await pool.query(
      `INSERT INTO user_profiles (user_id, id_verification_status)
       VALUES (?, 'pending_review')
       ON DUPLICATE KEY UPDATE id_verification_status = 'pending_review'`,
      [userId]
    );

    return this.getProfile(userId);
  }

  /**
   * Directory of users who can receive consultation bookings (seller / specialist roles).
   */
  async listConsultationSpecialists() {
    await this.ensureProfileColumns();
    let rows = [];
    try {
      const [fullRows] = await pool.query(
        `SELECT u.user_id, u.name, up.specialty, up.location, up.consultation_rate, up.profile_photo_path,
                up.expertise_json, up.skills_json
         FROM users u
         JOIN roles r ON r.role_id = u.role_id
         LEFT JOIN user_profiles up ON up.user_id = u.user_id
         WHERE r.role_name IN ('seller', 'specialist')
           AND (u.is_suspended IS NULL OR u.is_suspended = 0)
         ORDER BY u.name ASC`
      );
      rows = fullRows;
    } catch (_err) {
      // Database may be partially restored (missing profile/suspension columns).
      // Fallback still returns specialist cards using core user data.
      const [fallbackRows] = await pool.query(
        `SELECT u.user_id, u.name,
                NULL AS specialty, NULL AS location, NULL AS consultation_rate, NULL AS profile_photo_path,
                NULL AS expertise_json, NULL AS skills_json
         FROM users u
         JOIN roles r ON r.role_id = u.role_id
         WHERE r.role_name IN ('seller', 'specialist')
         ORDER BY u.name ASC`
      );
      rows = fallbackRows;
    }
    const toUrl = (p) => (p ? '/' + String(p).replace(/\\/g, '/') : null);

    const tagsFromProfile = (expertiseJson, skillsJson, specialty) => {
      const tags = [];
      const spec = specialty && String(specialty).trim();
      if (spec) tags.push(spec);
      const exp = parseJsonSafe(expertiseJson);
      const sk = parseJsonSafe(skillsJson);
      if (Array.isArray(exp)) {
        exp.forEach((e) => {
          if (typeof e === 'string') tags.push(e);
          else if (e && typeof e === 'object') {
            if (e.name) tags.push(String(e.name));
            else if (e.title) tags.push(String(e.title));
          }
        });
      }
      if (Array.isArray(sk)) {
        sk.forEach((e) => {
          if (typeof e === 'string') tags.push(e);
          else if (e && typeof e === 'object' && e.name) tags.push(String(e.name));
        });
      }
      return [...new Set(tags.map((t) => String(t).trim()).filter(Boolean))].slice(0, 5);
    };

    const bioFromProfile = (expertiseJson, specialty) => {
      const exp = parseJsonSafe(expertiseJson);
      if (Array.isArray(exp) && exp.length) {
        const first = exp[0];
        if (typeof first === 'string' && first.trim()) return first.trim();
        if (first && typeof first === 'object') {
          const d = first.description || first.summary || first.bio;
          if (d && String(d).trim()) return String(d).trim();
        }
      }
      if (specialty && String(specialty).trim()) {
        return `${String(specialty).trim()} — personalized hair and scalp guidance for your routine.`;
      }
      return 'Hair and scalp specialist — book a session for tailored advice and product direction.';
    };

    return rows.map((row) => {
      const bioFull = bioFromProfile(row.expertise_json, row.specialty);
      const bioSnippet = bioFull.length > 140 ? `${bioFull.slice(0, 137)}...` : bioFull;
      return {
        userId: row.user_id,
        name: row.name,
        specialty: row.specialty || null,
        location: row.location || null,
        consultationRate: row.consultation_rate != null ? Number(row.consultation_rate) : null,
        profilePhotoUrl: toUrl(row.profile_photo_path),
        expertiseTags: tagsFromProfile(row.expertise_json, row.skills_json, row.specialty),
        bioSnippet,
      };
    });
  }
}

module.exports = new ProfileService();