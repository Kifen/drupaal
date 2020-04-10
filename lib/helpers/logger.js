const winston = require("winston");
const appRoot = require("app-root-path");
const config = require("config");

/**
 * Config options for winston transports: file and console
 */
let options = {
  file: {
    level: "info",
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    prettyPrint: true,
    colorize: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    timeStamp: function () {
      return new Date().toLocaleDateString();
    },
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: true,
    colorize: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  },
};

/**
 * logger creates a winston logger using config options.
 */
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: true, // do not exit on handled exceptions
});

winston.addColors({
  error: "red",
  warn: "yellow",
  info: "cyan",
  debug: "green",
});

logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  },
};

process.on("unhandledRejection", (ex) => {
  throw ex;
});

module.exports = logger;
