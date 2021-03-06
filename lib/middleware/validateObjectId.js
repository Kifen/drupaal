const mongoose = require("mongoose");
const { logger, sendJSONResponse } = require("../helpers");

/**
 * middleware function checks request body and params
 * for objectIds, and check if the id is valid
 * @param{Object} req - request object
 * @param{Object} res - response object
 * @param{Object} next - middleware function
 */
module.exports = function (req, res, next) {
  let objectIds = [];
  if (req.params.id) objectIds.push(req.params.id);

  const keys = Object.keys(req.body);
  keys.forEach((key) => {
    const match = key.match(/(Id)$/);
    if (match) objectIds.push(req.body.key);
  });

  for (let id of objectIds) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error(`Invalid ID: <${req.params.id}>`);
      return sendJSONResponse(res, 404, null, "Invalid ID.");
    }
  }

  return next();
};
