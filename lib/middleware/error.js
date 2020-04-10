const { logger, sendJSONResponse } = require("../helpers");

/**
 * error handler middleware
 */
module.exports = function (err, req, res, next) {
  //log the exception
  logger.error(err.message, err);
  return sendJSONResponse(res, 500, null, err.message);
};
