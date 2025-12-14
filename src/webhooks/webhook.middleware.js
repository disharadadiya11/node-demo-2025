const { errorResponse } = require("../utils/apiResponse");

const webhookMiddleware = (req, res, next) => {
  // Store raw body for signature verification
  req.rawBody = JSON.stringify(req.body);
  next();
};

module.exports = webhookMiddleware;
