const emailTransporter = require("./email.client");
const { APP_URL, FRONTEND_URL } = require("../../config/env");

class EmailService {
  async sendEmail(to, subject, html, text) {
    try {
      const mailOptions = {
        from: `"Node 2025" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text,
      };

      const info = await emailTransporter.sendMail(mailOptions);
      console.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      console.log("Email sending failed:", error);
      throw new Error("Failed to send email");
    }
  }

  async sendWelcomeEmail(user) {
    const subject = "Welcome to Node 2025";
    const html = `
      <h1>Welcome ${user.name}!</h1>
      <p>Thank you for registering with us.</p>
      <p>We're excited to have you on board.</p>
    `;
    return await this.sendEmail(user.email, subject, html);
  }

  async sendOrderConfirmationEmail(user, order) {
    const subject = `Order Confirmation - ${order.orderNumber}`;
    const html = `
      <h1>Order Confirmed</h1>
      <p>Hi ${user.name},</p>
      <p>Your order ${order.orderNumber} has been confirmed.</p>
      <p>Total Amount: ₹${order.total}</p>
      <p>Thank you for your purchase!</p>
    `;
    return await this.sendEmail(user.email, subject, html);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const subject = "Password Reset Request";
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = `
      <h1>Password Reset</h1>
      <p>Hi ${user.name},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;
    return await this.sendEmail(user.email, subject, html);
  }
}

module.exports = new EmailService();
