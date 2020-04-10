const Joi = require("joi");

const postBook = {
  body: {
    title: Joi.string().min(1).max(50).required(),
    author: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(15).max(2000),
  },
};

const putBook = {
  body: {
    title: Joi.string().min(1).max(50),
    author: Joi.string().min(5).max(50),
    description: Joi.string().min(15).max(2000),
  },
};

const patchBook = {
  body: {
    star: Joi.number().min(1).max(5).required(),
  },
};

module.exports = {
  postBook,
  putBook,
  patchBook,
};
