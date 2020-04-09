const faker = require("faker");
const mongoose = require("mongoose");

const genMockUserData = () => {
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

const genMockBookData = () => {
  return {
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

const genMockBookUpdateData = () => {
  return {
    title: faker.random.words(),
    author: faker.name.findName(),
    description: faker.lorem.paragraph(),
  };
};

const genMockRateData = (x) => {
  return {
    star: x,
  };
};

function genNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
  genMockBookData,
  genMockUserData,
  genMockBookUpdateData,
  genMockRateData,
};
