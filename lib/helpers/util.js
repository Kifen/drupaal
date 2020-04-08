const Joi = require("joi");
const { badRequest } = require("@hapi/boom");

/**
 *sendJSONResponse returns a response to the client
 * @param {Object} res - The response object
 * @param {Object} status - The request object
 * @param {Object} data -
 * @param {string} message -
 */
const sendJSONResponse = (res, status, data, message) => {
  res.status(status).json({
    message,
    data,
  });
};

/**
 *handleFunc
 * @param {Object} fn - Middleware function
 */
const handleFunc = function (fn) {
  return function (req, res, next) {
    try {
      fn(req, res, next);
    } catch (ex) {
      next(ex);
    }
  };
};

/**
 *validate validates a request body against a provided schema
 * @param {Object} schema
 * @param {Object} options
 */
const validate = (schema, options) => {
  const requestOptions = options || {};

  return function (req, res, next) {
    const dataToValidate = {};
    if (!schema) return next;

    ["params", "body", "query"].forEach((key) => {
      if (schema[key]) {
        dataToValidate[key] = req[key];
      }
    });

    function onValidationComplete(err, validated) {
      if (err) {
        return next(badRequest(err.message, err.details));
      }

      //copy the validated object to the request object
      Object.assign(req, validated);
      return next();
    }

    return Joi.validate(
      dataToValidate,
      schema,
      requestOptions,
      onValidationComplete
    );
  };
};

module.exports = {
  sendJSONResponse,
  handleFunc,
  validate,
};
