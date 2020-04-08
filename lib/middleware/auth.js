const jwt = require("jsonwebtoken");
const config = require("config");
const { sendJSONResponse } = require("../helpers");

const authorize = (...roles) => {
  return function (req, res, next) {
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
        req.user = jwt.verify(authorization[1], config.get("jwtPrivateKey"));
        if (!roles) {
          return next();
        }
        const hasRole = roles.find((role) => req.user.role === role);
        if (!hasRole) return sendJSONResponse(res, 401, null, "Access denied!");

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
};

module.exports = authorize;
