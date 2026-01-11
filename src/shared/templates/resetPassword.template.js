/**
 * Password Reset Email Template
 *
 * @param {Object} options - Template options
 * @param {String} options.name - User's name
 * @param {String} options.resetLink - Password reset link URL
 * @returns {String} Complete HTML email
 */
const baseTemplate = require("./base.template");

const resetPasswordTemplate = ({ name, resetLink }) => {
  const title = "Password Reset Request";
  const body = `
    <h2>Password Reset</h2>
    <p>Hi ${name},</p>
    <p>You requested a password reset for your account. Click the button below to reset your password:</p>
    <p style="text-align: center;">
      <a href="${resetLink}" class="button">Reset Password</a>
    </p>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #3498db;">${resetLink}</p>
    <p><strong>This link will expire in 1 hour.</strong></p>
    <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
    <p>For security reasons, never share this link with anyone.</p>
    <p>Best regards,<br>The Node 2026 Team</p>
  `;

  return baseTemplate({ title, body });
};

module.exports = resetPasswordTemplate;
