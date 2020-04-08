const Joi = require("joi");

const postBook = {
  body: {
    title: Joi.string().min(1).max(50).required(),
    author: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(15).max(100),
  },
};

const patchBook = {
  body: {
    title: Joi.string().min(1).max(50),
    author: Joi.string().min(5).max(50),
    description: Joi.string().min(15).max(100),
    rating: Joi.number().min(1).max(5),
  },
};

module.exports = {
  postBook,
  patchBook,
};
