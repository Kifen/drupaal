const { sendJSONResponse, Role } = require("../../helpers");
const { User } = require("../../models");

/**
 * registerUser saves new users to mongoDB
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object}
 */
const registerUser = async (req, res) => {
  const user = await User.findUserByEmail(req.body.email);
  if (!user) {
    const data = await User.createUser(req.body);
    return sendJSONResponse(res, 201, data, "User registration successful!");
  }

  return sendJSONResponse(
    res,
    400,
    null,
    `User with email ${req.body.email} already exists.`
  );
};

/**
 * login logs in a user if username and password is valid
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const login = async (req, res) => {
  const user = await User.findUserByEmail(req.body.email);
  if (!user) return sendJSONResponse(res, 400, null, "User does not exist");

  const isValid = await user.verifyPassword(req.body.password);
  if (!isValid)
    return sendJSONResponse(res, 400, null, "Invalid email or password!");

  const token = user.generateAuthToken();

  return sendJSONResponse(
    res,
    200,
    { accesstoken: token },
    "Login successful."
  );
};

module.exports = {
  registerUser,
  login,
};
