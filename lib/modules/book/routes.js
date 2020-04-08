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

router.get(
  "/:id",
  handleFunc(validateObjectId),
  handleFunc(controller.getBook)
);

router.put(
  "/:id",
  handleFunc(authorize()),
  validate(policy.putBook),
  handleFunc(validateObjectId),
  handleFunc(controller.putBook)
);

router.patch(
  "/:id",
  handleFunc(authorize()),
  validate(policy.patchBook),
  handleFunc(validateObjectId),
  handleFunc(controller.patchBook)
);

router.delete(
  "/:id",
  handleFunc(authorize()),
  handleFunc(validateObjectId),
  handleFunc(controller.deleteBook)
);

module.exports = router;
