const express = require("express");
const router = express.Router();
const { handleGetProfile, handlePostEdit, handlePostUpload } = require("../controllers/profile");
const multer  = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/resume')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});
const upload = multer({ storage: storage });



router.get("/:user", handleGetProfile);
router.post("/edit", handlePostEdit);
router.post("/upload",upload.single('profileImg'),handlePostUpload);

module.exports = router;