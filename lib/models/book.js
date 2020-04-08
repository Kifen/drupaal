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
    try {
      new Fawn.Task()
        .save("books", book)
        .update(
          "users",
          { _id: req.user._id },
          { $push: { books_created: { _id: book._id, title: book.title } } }
        )
        .run();
      return { book };
    } catch (ex) {
      return sendJSONResponse(res, 500, null, ex.message);
    }
  }

  return !book;
};

bookSchema.statics.getAllBooks = async function () {
  const books = await this.find();
  return books;
};

bookSchema.statics.updateBook = async function (req) {
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

const Book = mongoose.model("Book", bookSchema);

module.exports = {
  bookSchema,
  Book,
};
