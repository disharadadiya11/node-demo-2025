const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/env");
const User = require("../../modules/users/user.model");
const { errorMessages } = require("../../shared/constants/messages");
const { StatusCodes } = require("http-status-codes");
const { buildError } = require("../../shared/response/apiResponse");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const result = buildError(
        StatusCodes.UNAUTHORIZED,
        errorMessages.UNAUTHORIZED
      );
      return res.status(result.statusCode).json(result);
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      const result = buildError(
        StatusCodes.UNAUTHORIZED,
        errorMessages.UNAUTHORIZED
      );
      return res.status(result.statusCode).json(result);
    }

    req.user = user;
    next();
  } catch (error) {
    let message = errorMessages.UNAUTHORIZED;

    if (error.name === "TokenExpiredError") {
      message = errorMessages.TOKEN_EXPIRED;
    }

    if (error.name === "JsonWebTokenError") {
      message = errorMessages.TOKEN_INVALID;
    }

    const result = buildError(StatusCodes.UNAUTHORIZED, message);
    return res.status(result.statusCode).json(result);
  }
};

module.exports = authenticate;
