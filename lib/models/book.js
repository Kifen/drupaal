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
    maxLenght: 1000,
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

/**
 * findBookByTitle retrieves a book by its title
 * @param{String} title - title of book
 * @returns{Object} - Book
 */
bookSchema.statics.findBookByTitle = async function (title) {
  const book = await this.findOne({ title });
  return book;
};

/**
 * createBook cretaes a book object and saves it to the Book collection
 * @param{Onject} bookData - object containing book info
 *  * @returns{Object} - newly created book document
 */
bookSchema.statics.createBook = async function (bookData) {
  const book = new Book({
    title: bookData.title,
    author: bookData.author,
    description: bookData.description,
    stars: {},
  });
  await book.save();
  return book;
};

/**
 * getAllBooks retrieves all books in Book collection
 * @returns{Array} - array of all book documents
 */
bookSchema.statics.getAllBooks = async function () {
  const books = await this.find();
  return books;
};

bookSchema.statics.getBookById = async function (id) {
  return await this.findById(id);
};

/**
 * updateBookById updates a book document
 * @param{Object} bookData - object containing book info
 * @param{String} id - id of book to be updated
 */
bookSchema.statics.updateBookById = async function (bookData, id) {
  const book = await this.findById(id);
  if (book) {
    for (let i in bookData) {
      book[i] = bookData[i];
    }
    await book.save();
    return book;
  }

  return false;
};

bookSchema.statics.deleteBookById = async function (id) {
  return await this.findByIdAndRemove(id);
};

/**
 * rateBookById rates a book and increases the number of reviews
 * and reviewers
 * @param{Object} bookData - object containing book info
 * @param{String} id - id of book to be rated
 * @param{String} id - id of user rating book
 */
bookSchema.statics.rateBookById = async function (data, bookId, userId) {
  const book = await this.findById(bookId);
  if (book) {
    const star = data.star;
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
    book.reviewers.push(userId);
    await book.save();
    return book;
  }

  return false;
};

/**
 * canRate checks if a user has already rated book
 * @param{String} bookId - id of book
 * @param{String} userId - id of user
 * @returns{Boolean}
 */
bookSchema.statics.canRate = async function (bookId, userId) {
  const book = await this.findById(bookId);
  if (book) {
    const valid = book.reviewers.find((id) => userId === id);
    return valid;
  }

  return false;
};

const Book = mongoose.model("Book", bookSchema);

module.exports = {
  bookSchema,
  Book,
};
