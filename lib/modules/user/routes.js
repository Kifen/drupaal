const express = require("express");
const policy = require("./policies");
const controller = require("./controller");
const { handleFunc, validate } = require("../../helpers");
const { authorize } = require("../../middleware");

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

router.get("/", handleFunc(authorize), handleFunc(controller.getUsers));

router.get("/profile", handleFunc(authorize), handleFunc(controller.getUser));

router.patch(
  "/profile",
  handleFunc(authorize),
  validate(policy.updatePassword),
  handleFunc(controller.updatePassword)
);

router.delete("/:id", handleFunc(authorize), handleFunc(controller.deleteUser));

module.exports = router;
