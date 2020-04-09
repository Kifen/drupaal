const faker = require("faker");
const mongoose = require("mongoose");

const genMockUserData = () => {
  return {
    //_id: new mongoose.Types.ObjectId().toHexString(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    books_created: [],
  };
};

const genMockBookData = () => {
  return {
    //_id: new mongoose.Types.ObjectId().toHexString(),
    title: faker.random.words(),
    author: faker.name.findName(),
    description: faker.lorem.paragraph(),
    reviews: 0,
    reviewers: [],
    stars: {
      one: 0,
      two: 0,
      three: 0,
      four: 0,
      five: 0,
    },
  };
};

module.exports = {
  genMockBookData,
  genMockUserData,
};
