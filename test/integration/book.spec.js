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
  const invalidId = "5e9065fec936fa46ed5d5af1";
  let user, book, userData, bookData, token, bookUpdateData, rateData;

  const execUser = async () => {
    token = await User.createUser(userData);
    user = await User.findUserByEmail(userData.email);
  };

  const execBook = async () => {
    book = new Book(bookData);
    await book.save();
  };

  before(async () => {
    bookData = genMockBookData();
    userData = genMockUserData();
    bookUpdateData = genMockBookUpdateData();
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
      await execUser();
      const { title, author } = bookData;
      const description = bookData.description.substring(0, 99);
      chai
        .request(app)
        .post(baseAPi)
        .set("Authorization", `Bearer ${token.accesstoken}`)
        .send({ title, author, description })
        .end(async (err, res) => {
          const u = await User.findById(user._id);
          expect(res.status).eql(201);
          expect(res.body.message).eql(`Book ${title} created.`);
          //expect(user.books_created[0]).to.be.a("string");
        });
    });

    it("should return 400 if book already exists", async () => {
      await execUser();
      await execBook();
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
        });
    });

    describe("Update Book: /PUT/:id", () => {
      it("should update book if user created book resource", async () => {
        await execUser();
        await execBook();
        await User.updateBooksCreated(book._id, user._id, "+");

        chai
          .request(app)
          .put(`${baseAPi}/${book._id.toString()}`)
          .set("Authorization", `Bearer ${token.accesstoken}`)
          .send({ title: "Lorem", author: "Berrik obi" })
          .end((err, res) => {
            expect(res.status).eql(200);
            expect(res.body.message).eql("Book updated.");
          });
      });

      it("should return 401 if user cdid not creat book", async () => {
        await execUser();
        await execBook();

        chai
          .request(app)
          .put(`${baseAPi}/${book._id.toString()}`)
          .set("Authorization", `Bearer ${token.accesstoken}`)
          .send({ title: "Lorem", author: "Berrik obi" })
          .end((err, res) => {
            expect(res.status).eql(401);
            expect(res.body.message).eql("User cannot write to resource.");
          });
      });

      it("should return 404 if book does not exist", async () => {
        await execUser();
        const { title, author } = bookData;
        const description = bookData.description.substring(0, 99);

        chai
          .request(app)
          .put(`${baseAPi}/${invalidId}`)
          .set("Authorization", `Bearer ${token.accesstoken}`)
          .send({ title, author, description })
          .end((err, res) => {
            expect(res.status).eql(404);
            expect(res.body.message).eql(
              `Book with id ${invalidId} does not exists.`
            );
          });
      });

      it("should return 401 if accesstoken is not provided", async () => {
        await execBook();

        chai
          .request(app)
          .put(`${baseAPi}/${book._id.toString()}`)
          .send({ title: "Lorem", author: "Berrik obi" })
          .end((err, res) => {
            expect(res.status).eql(401);
            expect(res.body.message).eql(
              "Authentication failed. Provide an access token."
            );
          });
      });

      it("should return 401 if request header Authorization has no value", async () => {
        await execBook();
        await execUser();

        chai
          .request(app)
          .put(`${baseAPi}/${book._id.toString()}`)
          .set("Authorization", `${token.accesstoken}`)
          .send({ title: "Lorem", author: "Berrik obi" })
          .end((err, res) => {
            expect(res.status).eql(401);
            expect(res.body.message).eql(
              "Authentication failed. Authorization header is invalid."
            );
          });
      });

      it("should return 401 if access token is invalid", async () => {
        await execBook();
        await execUser();

        chai
          .request(app)
          .put(`${baseAPi}/${book._id.toString()}`)
          .set("Authorization", `Bearer `)
          .send({ title: "Lorem", author: "Berrik obi" })
          .end((err, res) => {
            expect(res.status).eql(401);
            expect(res.body.message).eql(
              "Authentication failed. Token is invalid."
            );
          });
      });

      it("should return 404 if book id is invalid", async () => {
        await execUser();

        chai
          .request(app)
          .put(`${baseAPi}/1`)
          .set("Authorization", `Bearer ${token.accesstoken}`)
          .send({ title: "Lorem", author: "Berrik obi" })
          .end((err, res) => {
            expect(res.status).eql(404);
            expect(res.body.message).eql("Invalid ID.");
          });
      });
    });

    describe("Rate Book: /patch:id", () => {
      rateData = genMockRateData(4);

      it("should return 404 if book does not exist", async () => {
        await execUser();

        chai
          .request(app)
          .patch(`${baseAPi}/${invalidId}`)
          .set("Authorization", `Bearer ${token.accesstoken}`)
          .send(rateData)
          .end((err, res) => {
            expect(res.status).eql(404);
            expect(res.body.message).eql(
              `Book with id ${invalidId} not found.`
            );
          });
      });

      /*  it("should rate a book", async () => {
        await execBook();
        await execUser();
        console.log("ID == ", book._id);

        chai
          .request(app)
          .patch(`${baseAPi}/${book._id}`)
          .set("Authorization", `Bearer ${token.accesstoken}`)
          .send(rateData)
          .end(async (err, res) => {
            expect(res.status).eql(200);
            expect(res.body.message).eql(`Book ${book.title} rated.`);
          });
      }); */
    });

    describe("Delete Book: /DELETE/:id", () => {
      it("should return 401 if user does does not own book resource", async () => {
        await execBook();
        await execUser();

        chai
          .request(app)
          .delete(`${baseAPi}/${book._id}`)
          .set("Authorization", `Bearer ${token.accesstoken}`)
          .end((err, res) => {
            expect(res.status).eql(401);
            expect(res.body.message).eql("User cannot delete to resource.");
          });
      });

      /* it("should delete a book", async () => {
        await execBook();
        await execUser();
        await User.updateBooksCreated(book._id, user._id, "+");

        console.log("BOOK ID = ", book._id);
        chai
          .request(app)
          .delete(`${baseAPi}/${book._id}`)
          .set("Authorization", `Bearer ${token.accesstoken}`)
          .end((err, res) => {
            expect(res.status).eql(204);
            expect(res.body.message).eql(`Book ${book._id} deleted.`);
          });
      }); */
    });
  });
});
