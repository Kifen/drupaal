const { sendJSONResponse, Role } = require("../../helpers");
const { User } = require("../../models");

/**
 * registerUser saves new users to mongoDB
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object}
 */
const registerUser = async (req, res) => {
  const data = await User.createUser(req.body);
  if (!data)
    return sendJSONResponse(
      res,
      400,
      null,
      `User with email ${req.body.email} already exists.`
    );

  return sendJSONResponse(res, 201, data, "User registration successful!");
};

/**
 * login logs in a user if username and password is valid
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const login = async (req, res) => {
  const data = await User.authUser(req.body);
  if (!data)
    return sendJSONResponse(res, 400, null, "Invalid email or password!");

  return sendJSONResponse(res, 200, data, "Login successfull!");
};

module.exports = {
  registerUser,
  login,
};
