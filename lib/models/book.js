const mongoose = require("mongoose");
const User = require("./user");
const Fawn = require("fawn");

Fawn.init(mongoose);

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 1,
    maxLenght: 50,
    trim: true,
    required: true,
  },
  author: {
    type: String,
    minLength: 5,
    maxlength: 50,
    trim: true,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    trim: true,
    default: 0,
  },
  description: {
    type: String,
    minLength: 15,
    maxLenght: 100,
    required: true,
  },
});

bookSchema.statics.createBook = async function (req) {
  const book = await Book.findOne({ title: req.body.title });
  if (!book) {
    const book = new Book(req.body);
    await book.save();
    req.body._id = book._id;
    return book;
  }

  return !book;
};

bookSchema.statics.getAllBooks = async function () {
  const books = await this.find();
  return books;
};

bookSchema.statics.getBookById = async function (id) {
  return await this.findById(id);
};

bookSchema.statics.updateBookById = async function (req) {
  const { body } = req;
  const book = await this.findById(req.params.id);
  if (book) {
    for (let i in body) {
      book[i] = body[i];
    }
    await book.save();
    return book;
  }

  return false;
};

bookSchema.statics.deleteBookById = async function (id) {
  return await this.findByIdAndRemove(id);
};

bookSchema.statics.rateBookById = async function (req) {
  const { body } = req;
  const book = await this.findById(req.params.id);
  if (book) {
    book["rating"] = body["rating"];
    await book.save();
    return book;
  }

  return false;
};

const Book = mongoose.model("Book", bookSchema);

module.exports = {
  bookSchema,
  Book,
};
