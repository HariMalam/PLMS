const Course = require("../models/courses");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const Files = require("../models/files");
const fs = require("fs");
const Quiz = require("../models/quiz");
const QuizResult = require("../models/quizResult");

const handleGetProgramCourses = async (req, res) => {
  const user = req.user;
  let status = false;
  let id = null;
  if (user) {
    status = user.userType;
    id = user.username;
  }
  const courses = await Course.find().populate("files");
  res.render("programCourses.ejs", { status, id, courses });
};

const handlePostProgramCoursesCreate = async (req, res) => {
  const { courseName } = req.body;
  const newCourse = await Course.create({
    name: courseName,
  });
  res.redirect("/program-courses");
};

const handleGetProgramCoursePage = async (req, res) => {
  const user = req.user;
  let status = false;
  let id = null;
  if (user) {
    status = user.userType;
    id = user.username;
  }
  const courseId = req.params.id;
  const course = await Course.findById(courseId).populate("files");
  res.render("course.ejs", { status, id, course });
};

// Configure multer for storing PDF or MP4 files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "video/mp4"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and MP4 files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

const handlePostCourseUploadFile = async (req, res) => {
  try {
    const courseId = req.body.id;
    const course = await Course.findById(courseId).populate("files");
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }
    const uploadedFile = await Files.create({
      name: req.file.originalname,
      url: req.file.filename,
      type: req.file.mimetype === "application/pdf" ? "pdf" : "video",
    });
    course.files.push(uploadedFile._id);
    await course.save();
    res.redirect(`/program-courses/course/${courseId}`);
  } catch (error) {
    res.status(500).send("Error uploading file");
  }
};

const handleGetPdfFile = async (req, res) => {
  const fileId = req.params.id;
  const file = await Files.findById(fileId);

  const filePath = path.join(__dirname, "../uploads", file.url);
  res.setHeader("Content-Type", "application/pdf");
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error displaying file:", err);
      return res.status(500).send("Error displaying file");
    }
  });
};

const handleGetVideoFile = async (req, res) => {
  const fileId = req.params.id;
  const file = await Files.findById(fileId);

  const filePath = path.join(__dirname, "../uploads", file.url);
  const stat = await fs.promises.stat(filePath);

  const range = req.headers.range;
  const videoSize = stat.size;
  const CHUNK_SIZE = 10 ** 6; // 1MB

  let start = 0;
  let end = videoSize - 1;

  if (range) {
    start = Number(range.replace(/\D/g, ""));
    end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  }

  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(filePath, { start, end });
  videoStream.pipe(res);
};

const handleDeleteFile = async (req, res) => {
  const fileId = req.params.id;
  const file = await Files.findById(fileId);
  if (!file) {
    return res.status(404).send("File not found");
  }
  const filePath = path.join(__dirname, "../uploads", file.url);
  fs.unlink(filePath, async (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).send("Error deleting file");
    }
    await Files.findByIdAndDelete(fileId);
    const course = await Course.findOne({ files: fileId });
    course.files = course.files.filter((fileId) => fileId.toString() !== fileId);
    await course.save();
    res.redirect(`/program-courses/course/${course._id}`);
  });
};


const handleDeleteCourse = async (req, res) => {
  const courseId = req.params.id;

  const course = await Course.findById(courseId).populate("files").populate("files");
  if (!course) {
    return res.status(404).send("Course not found");
  }
  for (const file of course.files) {
    const filePath = path.join(__dirname, "../uploads", file.url);
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).send("Error deleting file");
      }
      await Files.findByIdAndDelete(file._id);
    });
  }

  const quiz = await Quiz.findOne({ courseId: courseId });
  if (quiz) {
    await Quiz.deleteMany({ courseId: courseId });
  }

  const quizResults = await QuizResult.find({ course: courseId });
  if (quizResults.length > 0) {
    await QuizResult.deleteMany({ course: courseId });
  }
  await Course.findByIdAndDelete(courseId);
  res.redirect("/program-courses");
};

module.exports = {
  handleGetProgramCourses,
  handlePostProgramCoursesCreate,
  handleGetProgramCoursePage,
  handlePostCourseUploadFile,
  upload,
  handleGetPdfFile,
  handleGetVideoFile,
  handleDeleteFile,
  handleDeleteCourse,
};
