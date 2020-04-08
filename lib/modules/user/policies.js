const Joi = require("joi");

const register = {
  body: {
    name: Joi.string().min(3).max(25).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required(),
    role: Joi.string().min(4).max(5),
  },
};

const login = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
};

const updatePassword = {
  body: {
    password: Joi.string().min(8).max(20).required(),
  },
};
module.exports = {
  register,
  login,
  updatePassword,
};
