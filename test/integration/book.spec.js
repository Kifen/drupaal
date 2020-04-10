const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../app");
const { User, Book } = require("../../lib/models");
const { expect } = require("chai");
const dbHandler = require("../helpers/db_handler");
const {
  genMockBookData,
  genMockUserData,
  genMockBookUpdateData,
  genMockRateData,
} = require("../helpers/mock");

chai.use(chaiHttp);

describe("/api/v1/books", () => {
  const baseAPi = "/api/v1/books";
  let user, book, userData, bookData, bookUpdateData, rateData;

  const execUser = async () => {
    user = new User({ email: userData.email, name: userData.name });
    await user.setPassword(userData.password);
    console.log();
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

  describe("Create book: /POST", () => {
    it("should create a new book", async () => {
      const token = await User.createUser(userData);
      const { title, author } = bookData;
      const description = bookData.description.substring(0, 99);
      chai
        .request(app)
        .post(baseAPi)
        .set("Authorization", `Bearer ${token.accesstoken}`)
        .send({ title, author, description })
        .end((err, res) => {
          expect(res.status).eql(201);
          expect(res.body.message).eql(`Book ${title} created.`);
          //expect(user.books_created[0]).to.be.a("string");
        });
    });

    it("should return 400 if book already exists", async () => {
      await Book.createBook(bookData);
      const token = await User.createUser(userData);
      const { title, author } = bookData;
      const description = bookData.description.substring(0, 99);
      chai
        .request(app)
        .post(baseAPi)
        .set("Authorization", `Bearer ${token.accesstoken}`)
        .send({ title, author, description })
        .end((err, res) => {
          expect(res.status).eql(400);
          expect(res.body.message).eql(`Book ${title} already exists.`);
          //expect(user.books_created[0]).to.be.a("string");
        });
    });
  });
});
