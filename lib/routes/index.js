const express = require("express");
const versionOne = require("./v1");

const router = express.Router();

router.use("/api/v1", versionOne);

module.exports = router;