const express = require("express");
const policy = require("./policies");
const controller = require("./controller");
const { handleFunc, validate } = require("../../helpers");

const router = express.Router();

/**
 * route handler to register a user
 */
router.post(
  "/register",
  validate(policy.register),
  handleFunc(controller.registerUser)
);

/**
 * route handler to login a user
 */
router.post("/login", validate(policy.login), handleFunc(controller.login));

module.exports = router;
