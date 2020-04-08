const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const { bookSchema } = require("./book");

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
  books_created: [bookSchema],
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
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
userSchema.methods.generateAuthToken = function (role) {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: role,
    },
    config.get("jwtPrivateKey"),
    { expiresIn: "1d" }
  );

  return token;
};

userSchema.statics.updateBooksCreated = async function (req) {
  const user = await User.findById(req.user._id);
  console.log(req.user._id);
  user.books_created.push(
    new bookSchema({
      _id: req.body.id,
      title: req.body.title,
      author: req.body.author,
    })
  );
  await user.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
