const express = require("express");
const { handleGetProgress } = require("../controllers/progress");
const router = express.Router();

router.get("/", handleGetProgress);

module.exports = router;
