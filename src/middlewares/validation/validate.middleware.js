const { errorMessages } = require("../../shared/constants/messages");
const { buildError } = require("../../shared/response/apiResponse");

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

      const response = buildError(400, errorMessages.VALIDATION_ERROR);
      response.errors = errors;

      return res.status(400).json(response);
    }

    req.body = value;
    next();
  };
};

module.exports = validate;
