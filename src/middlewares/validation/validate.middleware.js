const { errorMessages } = require("../../shared/constants/messages");
const { errorResponse } = require("../../shared/response/apiResponse");

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return errorResponse(res, 400, errorMessages.VALIDATION_ERROR, errors);
    }

    req.body = value;
    next();
  };
};

module.exports = validate;
