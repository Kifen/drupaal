const mongoose = require("mongoose");

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
  reviews: {
    type: Number,
    min: 0,
    default: 0,
  },
  reviewers: [String],
  description: {
    type: String,
    minLength: 15,
    maxLenght: 100,
    required: true,
  },
  stars: {
    type: new mongoose.Schema({
      one: {
        type: Number,
        min: 0,
        trim: true,
        default: 0,
      },
      two: {
        type: Number,
        min: 0,
        trim: true,
        default: 0,
      },
      three: {
        type: Number,
        min: 0,
        trim: true,
        default: 0,
      },
      four: {
        type: Number,
        min: 0,
        trim: true,
        default: 0,
      },
      five: {
        type: Number,
        min: 0,
        trim: true,
        default: 0,
      },
    }),
    required: true,
  },
});

bookSchema.statics.createBook = async function (req) {
  const book = await Book.findOne({ title: req.body.title });
  if (!book) {
    const { body } = req;
    const book = new Book({
      title: body.title,
      author: body.author,
      description: body.description,
      stars: {},
    });
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
    const star = body.star;
    switch (star) {
      case 1:
        book.stars.one += 1;
        break;
      case 2:
        book.stars.two += 1;
        break;
      case 3:
        book.stars.three += 1;
        break;
      case 4:
        book.stars.four += 1;
        break;
      case 5:
        book.stars.five += 1;
        break;
    }

    book.reviews += 1;
    book.reviewers.push(req.user._id);
    await book.save();
    return book;
  }

  return false;
};

bookSchema.statics.canRate = async function (req) {
  const book = await this.findById(req.params.id);
  if (book) {
    const valid = book.reviewers.find((id) => req.user._id === id);
    return valid;
  }

  return false;
};

const Book = mongoose.model("Book", bookSchema);

module.exports = {
  bookSchema,
  Book,
};
