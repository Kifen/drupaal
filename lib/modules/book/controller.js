const { Book, User } = require("../../models");
const { sendJSONResponse } = require("../../helpers");

const postBook = async (req, res) => {
  const book = await Book.findBookByTitle(req.body.title);
  if (book)
    return sendJSONResponse(
      res,
      400,
      null,
      `Book ${req.body.title} already exists.`
    );

  const data = await Book.createBook(req.body);
  req.body._id = data._id;
  await User.updateBooksCreated(data._id, req.user._id, "+");
  return sendJSONResponse(res, 201, data, `Book ${req.body.title} created.`);
};

const getBooks = async (req, res) => {
  const books = await Book.getAllBooks();
  return sendJSONResponse(res, 200, books, "Success.");
};

const getBook = async (req, res) => {
  const book = await Book.getBookById(req.params.id);
  if (!book)
    return sendJSONResponse(
      res,
      404,
      null,
      `Book with id ${req.params.id} not found.`
    );

  return sendJSONResponse(res, 200, book, "Success.");
};

const putBook = async (req, res) => {
  const book = await Book.getBookById(req.params.id);
  if (!book)
    return sendJSONResponse(
      res,
      404,
      null,
      `Book with id ${req.params.id} does not exists.`
    );

  const canPut = await User.perm(req.user._id, req.params.id);
  if (canPut) {
    const book = await Book.updateBookById(req.body, req.params.id);
    return sendJSONResponse(res, 200, book, "Book updated.");
  }

  return sendJSONResponse(res, 401, null, "User cannot write to resource.");
};

const deleteBook = async (req, res) => {
  const canDelete = await User.perm(req.user._id, req.params.id);
  if (canDelete) {
    const book = await Book.deleteBookById(req.params.id);
    if (!book)
      return sendJSONResponse(
        res,
        404,
        null,
        `Book with id ${req.params.id} not found.`
      );

    await User.updateBooksCreated(req.params.id, req.user._id, "-");
    return sendJSONResponse(res, 204, null, `Book ${req.params.id} deleted.`);
  }

  return sendJSONResponse(res, 401, null, "User cannot delete to resource.");
};

const patchBook = async (req, res) => {
  const valid = await Book.canRate(req);
  console.log(valid);
  if (!valid) {
    const book = await Book.rateBookById(req.body, req.params.id, req.user._id);
    if (!book)
      return sendJSONResponse(
        res,
        404,
        null,
        `Book with id ${req.params.id} not found.`
      );

    return sendJSONResponse(res, 200, book, `Book ${book.title} rated.`);
  }

  return sendJSONResponse(res, 401, null, "User cannot rate resource.");
};

module.exports = {
  postBook,
  getBooks,
  getBook,
  putBook,
  patchBook,
  deleteBook,
};
