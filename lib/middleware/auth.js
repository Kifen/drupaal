const jwt = require("jsonwebtoken");
const config = require("config");
const { sendJSONResponse } = require("../helpers");

const authorize = (...roles) => {
  return function (req, res, next) {
    const token = req.headers.authorization;
    if (!token)
      return sendJSONResponse(
        res,
        401,
        null,
        "Authentication failed. Provide an authentication token."
      );

    try {
      const payload = jwt.verify(token, config.get("jwtPrivateKey"));
      req.user = payload;
      if (!roles) {
        return next();
      }
      const hasRole = roles.find((role) => req.user.role === role);
      if (!hasRole) return sendJSONResponse(res, 401, null, "Access denied!");

      return next();
    } catch (ex) {
      return sendJSONResponse(
        res,
        400,
        null,
        "Authentication failed. Token is invalid."
      );
    }
  };
};

module.exports = authorize;
