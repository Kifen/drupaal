const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const { Book, bookSchema } = require("./book");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLenght: 25,
    trim: true,
    required: true,
  },
  email: { type: String, unique: true, trim: true },
  password: {
    type: String,
    minLength: 8,
    maxLenght: 20,
    trim: true,
    required: true,
  },
  books_created: [String],
});

/**
 * setPassword hashes a password and sets it in the userSchema
 * @param {string} password - User password
 */
userSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
};

/**
 * verifyPassword verifies a password
 * @param {string} - User password
 * @returns {boolean}
 */
userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * generateAuthToken generates a json web token
 * @returns {string}
 */
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    config.get("jwtPrivateKey"),
    { expiresIn: "1d" }
  );

  return token;
};

userSchema.statics.updateBooksCreated = async function (
  bookId,
  userId,
  action
) {
  const user = await this.findById(userId);
  if (user) {
    if (action === "+") {
      user.books_created.push(bookId);
    } else {
      user.books_created.splice(user.books_created.indexOf(bookId), 1);
    }
    await user.save();
    return;
  }
};

userSchema.statics.perm = async function (userId, bookId) {
  const user = await this.findById(userId);
  if (user) {
    const valid = user.books_created.find((id) => bookId === id);
    return valid;
  }

  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;