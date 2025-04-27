const express = require("express");
const {
  handleGetQuizList,
  handleGetQuiz,
  handlePostCreateQuizQuestion,
  handlePostDeleteQuizQuestion,
  handlePostSubmitQuiz,
  handleGetQuizResultPage,
} = require("../controllers/quiz");
const router = express.Router();

router.get("/", handleGetQuizList);
router.post("/create", handlePostCreateQuizQuestion);
router.post("/delete", handlePostDeleteQuizQuestion);
router.post("/submit", handlePostSubmitQuiz); // Assuming this is for updating a quiz question
router.get("/result/:id", handleGetQuizResultPage);
router.get("/:id", handleGetQuiz);

module.exports = router;
