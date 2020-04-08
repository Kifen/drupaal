const express = require("express");
const userRoute = require("../../modules/user");
const bookRoute = require("../../modules/book");

const router = express.Router();

router.use("/users", userRoute);
router.use("/books", bookRoute);

module.exports = router;
