const { NODE_ENV } = require("../../config/env");
const { buildError } = require("../../shared/response/apiResponse");
const { errorMessages } = require("../../shared/constants/messages");

module.exports.errorHandler = (err, req, res, next) => {
  // Defaults
  let statusCode = err?.statusCode || 500;
  let message = err?.message || errorMessages.INTERNAL_SERVER_ERROR;

  /**
   * Mongoose: Invalid ObjectId
   */
  if (err?.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  /**
   * Mongoose: Duplicate key
   */
  if (err?.code === 11000 && err?.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 400;
    message = `${field} already exists`;
  }

  /**
   * Mongoose: Validation error
   */
  if (err?.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  /**
   * Joi validation error
   */
  if (err?.isJoi) {
    statusCode = 400;
    message = err.details.map((d) => d.message).join(", ");
  }

  /**
   * JWT errors
   */
  if (err?.name === "JsonWebTokenError") {
    statusCode = 401;
    message = errorMessages.TOKEN_INVALID;
  }

  if (err?.name === "TokenExpiredError") {
    statusCode = 401;
    message = errorMessages.TOKEN_EXPIRED;
  }

  const response = buildError(statusCode, message);

  /**
   * Stack trace only in development
   */
  if (NODE_ENV === "development") {
    response.stack = err?.stack;
  }

  return res.status(statusCode).json(response);
};
