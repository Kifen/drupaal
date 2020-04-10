const chai = require("chai");
const chaiHttp = require("chai-http");
const dbHandler = require("../helpers/db_handler");
const app = require("../../app");
const { User } = require("../../lib/models");
const { genMockUserData } = require("../helpers/mock");
const faker = require("faker");

const { expect } = chai;

chai.use(chaiHttp);

describe("/api/vi/users", () => {
  const baseAPi = "/api/v1/users";
  const invalidPassword = faker.internet.password();
  let user, userData;

  const execUser = async () => {
    user = new User({ email: userData.email, name: userData.name });
    await user.setPassword(userData.password);
    console.log();
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

  describe("Register User: /POST", () => {
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

    it("should return 400 if user already exists", async () => {
      await execUser();
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
        });
    });

    describe("Login User: /POST", () => {
      it("should login a user if credential is valid", async () => {
        await execUser();
        const body = { email: userData.email, password: userData.password };
        chai
          .request(app)
          .post(`${baseAPi}/login`)
          .send(body)
          .end((err, res) => {
            expect(res.status).eql(200);
            expect(res.body.message).eql("Login successful.");
            expect(res.body.data).to.have.property("accesstoken");
          });
      });

      it("should return 400 if user does not exist", async () => {
        const body = { email: userData.email, password: userData.password };
        chai
          .request(app)
          .post(`${baseAPi}/login`)
          .send(body)
          .end((err, res) => {
            expect(res.status).eql(400);
            expect(res.body.message).eql("User does not exist.");
          });
      });

      it("should return 400 if password is invalid", async () => {
        await execUser();
        const body = { email: userData.email, password: invalidPassword };
        chai
          .request(app)
          .post(`${baseAPi}/login`)
          .send(body)
          .end((err, res) => {
            expect(res.status).eql(400);
            expect(res.body.message).eql("Invalid email or password!");
          });
      });
    });
  });
});
