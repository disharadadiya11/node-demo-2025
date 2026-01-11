const { errorMessages } = require("../../shared/constants/messages");
const { buildError } = require("../../shared/response/apiResponse");

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(buildError(401, errorMessages.UNAUTHORIZED));
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json(buildError(403, errorMessages.FORBIDDEN));
    }

    next();
  };
};

module.exports = authorize;
