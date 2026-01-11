module.exports.buildSuccess = (statusCode, message, data = null) => ({
  statusCode,
  success: true,
  message,
  ...(data && { data }),
});

module.exports.buildError = (statusCode, message) => ({
  statusCode,
  success: false,
  message,
});
