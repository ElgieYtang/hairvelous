/**
 * Email Service
 * Location: backend/services/emailService.js
 * Purpose: Send transactional emails (e.g., password reset)
 */
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.host = String(process.env.SMTP_HOST || '').trim();
    this.port = Number(process.env.SMTP_PORT || 0) || 587;
    this.secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
    this.user = String(process.env.SMTP_USER || '').trim();
    this.pass = String(process.env.SMTP_PASS || '').trim();
    this.from = String(process.env.MAIL_FROM || this.user || '').trim();
    this._transporter = null;
  }

  isConfigured() {
    return !!(this.host && this.port && this.user && this.pass && this.from);
  }

  getTransporter() {
    if (this._transporter) return this._transporter;
    if (!this.isConfigured()) return null;
    this._transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: this.secure,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });
    return this._transporter;
  }

  async sendPasswordResetEmail(toEmail, displayName, resetLink) {
    const transporter = this.getTransporter();
    if (!transporter) return { sent: false, reason: 'smtp_not_configured' };

    const safeName = String(displayName || 'there');
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
        <h2 style="margin:0 0 12px;">Hairvelous password reset</h2>
        <p>Hi ${safeName},</p>
        <p>We received a request to reset your password. Click the button below to set a new one. This link expires in 1 hour.</p>
        <p style="margin:18px 0;">
          <a href="${resetLink}" style="background:#7c3aed;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;display:inline-block;">Reset password</a>
        </p>
        <p>If the button does not work, copy and paste this URL into your browser:</p>
        <p style="word-break:break-all;"><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `;

    await transporter.sendMail({
      from: this.from,
      to: toEmail,
      subject: 'Hairvelous password reset',
      text: `Reset your Hairvelous password using this link (valid for 1 hour): ${resetLink}`,
      html,
    });
    return { sent: true };
  }
}

module.exports = new EmailService();

