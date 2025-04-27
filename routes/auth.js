const express = require("express");
const router = express.Router();
const { handleGetLogin, handleGetSignup, handlePostSignup, handlePostLogin, handleLogout } = require("../controllers/auth");

router.get("/login", handleGetLogin);
router.get("/signup", handleGetSignup);
router.post("/signup", handlePostSignup);
router.post("/login", handlePostLogin);
router.get("/logout", handleLogout);

module.exports = router;