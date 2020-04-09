const express = require("express");
const versionOneRoute = require("./v1");

const router = express.Router();

router.use("drupaal.herokuapp.com/api/v1", versionOneRoute);

module.exports = router;
