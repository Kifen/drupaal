const jwt = require("jsonwebtoken");
const config = require("config");
const { sendJSONResponse } = require("../helpers");

const authorize = (req, res, next) => {
  if (req.headers.authorization) {
    try {
      let authorization = req.headers["authorization"].split(" ");
      if (authorization[0] !== "Bearer")
        return sendJSONResponse(
          res,
          401,
          null,
          "Authentication failed. Authorization header is invalid."
        );
      const payload = jwt.verify(authorization[1], config.get("jwtPrivateKey"));
      req.user = payload;
      return next();
    } catch (ex) {
      return sendJSONResponse(
        res,
        401,
        null,
        "Authentication failed. Token is invalid."
      );
    }
  }
  return sendJSONResponse(
    res,
    401,
    null,
    "Authentication failed. Provide an access token."
  );
};

module.exports = authorize;
