const config = require("config");
require("express-async-errors");
require("./lib/models/db")();
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
const { logger } = require("./lib/helpers");
const morgan = require("morgan");
const apiRoutes = require("./lib/routes");
const { error } = require("./lib/middleware");

const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

app.use(express.json({ limit: "50mb" }));
app.use(morgan("combined", { stream: logger.stream }));
app.use("/", apiRoutes);
app.use(error);

if (!config.get("jwtPrivateKey")) {
  throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
}

app.listen(port, () => {
  logger.info(
    `Server listening on port ${port}, and running in ${process.env.NODE_ENV} environment...`
  );
});

module.exports = app;
