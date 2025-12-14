const { NODE_ENV } = require("../config/env");
const { errorResponse } = require("../utils/apiResponse");
const { errorMessages } = require("../messages");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = { message: errorMessages.TOKEN_INVALID, statusCode: 401 };
  }

  if (err.name === "TokenExpiredError") {
    error = { message: errorMessages.TOKEN_EXPIRED, statusCode: 401 };
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || errorMessages.INTERNAL_SERVER_ERROR;

  errorResponse(
    res,
    statusCode,
    message,
    NODE_ENV === "development" ? err.stack : undefined
  );
};

module.exports = errorHandler;
