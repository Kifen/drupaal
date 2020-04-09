const mongoose = require("mongoose");
const { logger } = require("../helpers");
const config = require("config");

module.exports = () => {
  const options = {
    poolSize: 10,
    useCreateIndex: true,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  logger.info("LOG ==== ", config.get("db"));
  mongoose.connect(config.get("db"), options);

  if (process.env.NODE_ENV === "development") {
    mongoose.set("debug", true);
  }

  mongoose.connection.on("connected", () => {
    logger.info(`Connected to mongoDB: <${config.get("db")}>`);
  });

  mongoose.connection.on("error", (e) => {
    logger.error(e.message, e);
  });

  mongoose.connection.on("disconnected", () => {
    logger.info("Disconnected from mongoDB...");
  });
};
