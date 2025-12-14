const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { errorMessages } = require('../messages');
const { errorResponse } = require('../utils/apiResponse');
const User = require('../modules/users/user.model');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return errorResponse(res, 401, errorMessages.UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return errorResponse(res, 401, errorMessages.UNAUTHORIZED);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, errorMessages.TOKEN_EXPIRED);
    }
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, errorMessages.TOKEN_INVALID);
    }
    return errorResponse(res, 401, errorMessages.UNAUTHORIZED);
  }
};

module.exports = authenticate;

