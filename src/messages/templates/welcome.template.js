/**
 * Welcome Email Template
 * 
 * @param {Object} options - Template options
 * @param {String} options.name - User's name
 * @returns {String} Complete HTML email
 */
const baseTemplate = require("./base.template");

const welcomeTemplate = ({ name }) => {
  const title = "Welcome to Node 2025";
  const body = `
    <h2>Welcome ${name}!</h2>
    <p>Thank you for registering with us. We're excited to have you on board!</p>
    <p>Your account has been successfully created and you can now start using our services.</p>
    <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
    <p>Best regards,<br>The Node 2025 Team</p>
  `;

  return baseTemplate({ title, body });
};

module.exports = welcomeTemplate;

