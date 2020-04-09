const { User, Book } = require("../../lib/models");
const { expect } = require("chai");
const dbHandler = require("../helpers/db_handler");
const {
  genMockBookData,
  genMockUserData,
  genMockBookUpdateData,
} = require("../helpers/mock");

describe("Book Model", () => {
  let user, book, userData, bookData, bookUpdateData;

  const execUser = async () => {
    user = new User(userData);
    await user.save();
  };

  const execBook = async () => {
    book = new Book(bookData);
    await book.save();
  };

  before(async () => {
    bookData = genMockBookData();
    userData = genMockUserData();
    await dbHandler.connect();
  });

  after(async () => {
    await dbHandler.closeDatabase();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  describe("Create Book", () => {
    it("should create book", async () => {
      await Book.createBook(bookData);
      const book = await Book.findOne({ title: bookData.title });
      expect(book.title).to.eql(bookData.title);
      expect(book.author).to.eql(bookData.author);
      expect(book.description).to.eql(bookData.description);
    });
  });

  describe("Update Book", () => {
    bookUpdateData = genMockBookUpdateData();
    const id = "5e8f6d163b62543a547b8796";

    it("should update book if book exists", async () => {
      execBook();

      const b = await Book.updateBookById(bookUpdateData, book._id.toString());
      expect(b._id).eql(book._id);
      expect(b).to.deep.include(bookUpdateData);
    });

    it("should return false if book does't exist", async () => {
      const val = await Book.updateBookById(bookUpdateData, id);
      expect(val).to.be.false;
    });
  });
});
