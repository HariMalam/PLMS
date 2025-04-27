const express = require("express");
const {
  handleGetProgramCourses,
  handlePostProgramCoursesCreate,
  handleGetProgramCoursePage,
  handlePostCourseUploadFile,
  upload,
  handleGetPdfFile,
  handleGetVideoFile,
  handleDeleteFile,
  handleDeleteCourse,
} = require("../controllers/programCourses");
const router = express.Router();

router.get("/", handleGetProgramCourses);
router.get("/course/:id", handleGetProgramCoursePage);
router.get("/course/delete/:id", handleDeleteCourse);
router.post("/create", handlePostProgramCoursesCreate);
router.post("/upload-file", upload.single("file"), handlePostCourseUploadFile);
router.get("/file/delete/:id", handleDeleteFile);
router.get("/pdf/:id", handleGetPdfFile);
router.get("/video/:id", handleGetVideoFile);
module.exports = router;
