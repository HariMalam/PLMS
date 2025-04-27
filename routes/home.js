const express = require("express");
const router = express.Router();
const { handleGetHome } = require("../controllers/home");

router.get("/", handleGetHome);

module.exports = router;