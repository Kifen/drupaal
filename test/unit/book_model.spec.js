const { User, Book } = require("../../lib/models");
const { expect } = require("chai");
const dbHandler = require("../helpers/db_handler");
const {
  genMockBookData,
  genMockUserData,
  genMockBookUpdateData,
  genMockRateData,
} = require("../helpers/mock");

describe("Book Model", () => {
  let user, book, userData, bookData, bookUpdateData, rateData;

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
    const id2 = "5e8f74ba072b9c4c523ad28e";

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

    describe("Rate Book", () => {
      const star = 5;
      rateData = genMockRateData(star);

      it("should rate book if book exists", async () => {
        execBook();
        execUser();
        await User.updateBooksCreated(book._id, user._id, "+");
        const b = await Book.rateBookById(rateData, book._id, user._id);
        const u = await User.findOne({ email: user.email });

        console.log(u._id);
        expect(b.reviews).to.be.eql(1);
        expect(b.stars.five).to.eql(1);
        expect(b.reviewers).to.include(u._id);
      });

      it("should return false if book doesn't exists", async () => {
        const b = await Book.rateBookById(rateData, id, id2);
        expect(b).to.be.false;
      });
    });
  });
});
