const emailTransporter = require("./email.client");
const { FRONTEND_URL } = require("../../config/env");
const baseTemplate = require("../../shared/templates/base.template");
const welcomeTemplate = require("../../shared/templates/welcome.template");
const resetPasswordTemplate = require("../../shared/templates/resetPassword.template");

class EmailService {
  async sendEmail(to, subject, html, text) {
    try {
      const mailOptions = {
        from: `"Node 2026" <${process.env.EMAIL_USER}>`,
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
    const subject = "Welcome to Node 2026";
    const html = welcomeTemplate({ name: user.name });
    return await this.sendEmail(user.email, subject, html);
  }

  async sendOrderConfirmationEmail(user, order) {
    const subject = `Order Confirmation - ${order.orderNumber}`;
    const title = "Order Confirmed";
    const body = `
      <h2>Order Confirmed</h2>
      <p>Hi ${user.name},</p>
      <p>Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
      <p>Total Amount: <strong>₹${order.total}</strong></p>
      <p>Thank you for your purchase! We'll keep you updated on your order status.</p>
      <p>Best regards,<br>The Node 2026 Team</p>
    `;
    const html = baseTemplate({ title, body });
    return await this.sendEmail(user.email, subject, html);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const subject = "Password Reset Request";
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = resetPasswordTemplate({
      name: user.name,
      resetLink: resetUrl,
    });
    return await this.sendEmail(user.email, subject, html);
  }
}

module.exports = new EmailService();
