const chai = require("chai");
const chaiHttp = require("chai-http");
const dbHandler = require("../helpers/db_handler");
const app = require("../../app");
const { User } = require("../../lib/models");
const { genMockUserData } = require("../helpers/mock");

const { expect } = chai;

chai.use(chaiHttp);

describe("/api/vi/users", () => {
  const baseAPi = "/api/v1/users";
  let user, userData;

  const execUser = async () => {
    user = new User(userData);
    await user.save();
  };

  before(async () => {
    userData = genMockUserData();
    await dbHandler.connect();
  });

  after(async () => {
    await dbHandler.closeDatabase();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  describe("Register User", () => {
    it("should register a user if user", (done) => {
      chai
        .request(app)
        .post(`${baseAPi}/register`)
        .send(userData)
        .end((err, res) => {
          expect(res.status).eql(201);
          expect(res.body.data).to.have.property("accesstoken");
          expect(res.body.message).eql("User registration successful!");
          done();
        });
    });

    it("should return 400 if user already exists", (done) => {
      execUser();
      chai
        .request(app)
        .post(`${baseAPi}/register`)
        .send(userData)
        .end((err, res) => {
          expect(res.status).eql(400);
          expect(res.body.message).eql(
            `User with email ${user.email} already exists.`
          );
          expect(res.body.data).to.be.null;
          done();
        });
    });
  });
});
