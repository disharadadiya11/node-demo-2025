const { errorMessages } = require('../messages');
const { errorResponse } = require('../utils/apiResponse');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, errorMessages.UNAUTHORIZED);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, errorMessages.FORBIDDEN);
    }

    next();
  };
};

module.exports = authorize;

