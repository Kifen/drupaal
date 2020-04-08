const _ = require("lodash");
const { sendJSONResponse, Role } = require("../../helpers");
const { User } = require("../../models");

/**
 * registerUser saves new users to mongoDB
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object}
 */
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists)
    return sendJSONResponse(
      res,
      400,
      null,
      "Account with this email already exists!"
    );

  const user = new User({ name: name, email: email, role: role || Role.USER });
  await user.setPassword(password);
  //console.log(typeof User.updateBooksCreated);
  //req.user = user;
  //await User.updateBooksCreated(req);
  await user.save();

  const token = user.generateAuthToken(role || Role.USER);
  const data = {
    token,
    user: _.pick(user, ["_id", "name", "email", "role"]),
  };

  return sendJSONResponse(res, 201, data, "User registration successful!");
};

/**
 * login logs in a user if username and password is valid
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return sendJSONResponse(res, 400, null, "Invalid email or password!");

  const isValid = await user.verifyPassword(password);
  if (!isValid)
    return sendJSONResponse(res, 404, null, "Invalid email or password");

  const token = user.generateAuthToken(user.role);
  const data = {
    token,
    user: _.pick(user, ["name", "email"]),
  };

  return sendJSONResponse(res, 200, data, "Login successfull!");
};

const getUsers = async (req, res) => {
  const users = await User.find().sort("name");
  return sendJSONResponse(res, 200, users, "Success.");
};

const getUser = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user)
    return sendJSONResponse(
      res,
      404,
      null,
      `User with id ${req.params.id} not found`
    );

  return sendJSONResponse(res, 200, { user }, "Success");
};

const updatePassword = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user)
    return sendJSONResponse(
      res,
      404,
      null,
      `User with id ${req.params.id} not found.`
    );

  await user.setPassword(req.body.password);
  await user.save();
  return sendJSONResponse(res, 200, { user }, "Updated password successfully.");
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user)
    return sendJSONResponse(
      res,
      404,
      null,
      `User with id ${req.params.id} not found.`
    );

  return sendJSONResponse(
    res,
    200,
    { user },
    `Deleted user with id ${req.params.id}.`
  );
};

module.exports = {
  registerUser,
  login,
  getUsers,
  getUser,
  updatePassword,
  deleteUser,
};
