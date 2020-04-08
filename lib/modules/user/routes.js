const express = require("express");
const policy = require("./policies");
const controller = require("./controller");
const { handleFunc, validate, Role } = require("../../helpers");
const { authorize, validateObjectId } = require("../../middleware");

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

router.get(
  "/",
  handleFunc(authorize(Role.ADMIN)),
  handleFunc(controller.getUsers)
);

router.get(
  "/profile",
  handleFunc(authorize(Role.USER, Role.ADMIN)),
  handleFunc(controller.getUser)
);

router.patch(
  "/profile",
  handleFunc(authorize(Role.USER)),
  validate(policy.updatePassword),
  handleFunc(controller.updatePassword)
);

router.delete(
  "/:id",
  handleFunc(authorize(Role.ADMIN)),
  handleFunc(controller.deleteUser)
);

module.exports = router;
