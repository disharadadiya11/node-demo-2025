const razorpayService = require('./razorpay/razorpay.service');
const s3Service = require('./aws/s3.service');
const emailService = require('./email/email.service');

module.exports = {
  razorpayService,
  s3Service,
  emailService,
};

