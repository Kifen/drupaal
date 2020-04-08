const express = require("express");
const policy = require("./policies");
const controller = require("./controller");
const { handleFunc, validate } = require("../../helpers");
const { authorize, validateObjectId } = require("../../middleware");

const router = express.Router();

router.post(
  "/",
  handleFunc(authorize()),
  validate(policy.postBook),
  handleFunc(controller.postBook)
);

router.get("/", handleFunc(controller.getBooks));

router.patch(
  "/:id",
  handleFunc(authorize()),
  validate(policy.patchBook),
  handleFunc(validateObjectId),
  handleFunc(controller.patchBook)
);

module.exports = router;
