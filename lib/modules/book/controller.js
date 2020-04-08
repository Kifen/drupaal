const { Book } = require("../../models");
const { sendJSONResponse } = require("../../helpers");

const postBook = async (req, res) => {
  const book = await Book.createBook(req);
  if (!book)
    return sendJSONResponse(
      res,
      400,
      null,
      `Book ${req.body.title} already exists.`
    );

  console.log(book.title);
  return sendJSONResponse(res, 201, book, `Book ${req.body.title} created.`);
};

const getBooks = async (req, res) => {
  const books = await Book.getAllBooks();
  return sendJSONResponse(res, 200, books, "Success.");
};

const patchBook = async (req, res) => {
  const book = await Book.updateBook(req);
  if (!book)
    return sendJSONResponse(
      res,
      404,
      null,
      `Book with id ${req.params.id} does not exists.`
    );

  return sendJSONResponse(res, 200, book, "Book updated.");
};
module.exports = {
  postBook,
  getBooks,
  patchBook,
};
