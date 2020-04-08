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
  "/:id",
  handleFunc(validateObjectId),
  handleFunc(authorize(Role.USER, Role.ADMIN)),
  handleFunc(controller.getUser)
);

router.patch(
  "/:id",
  handleFunc(authorize(Role.USER)),
  validate(policy.updatePassword),
  handleFunc(validateObjectId),
  handleFunc(controller.updatePassword)
);

router.delete(
  "/:id",
  handleFunc(authorize(Role.ADMIN)),
  handleFunc(controller.deleteUser)
);

module.exports = router;
