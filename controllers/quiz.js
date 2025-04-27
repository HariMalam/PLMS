const Course = require("../models/courses");
const Quiz = require("../models/quiz");
const QuizResult = require("../models/quizResult");

const handleGetQuizList = async (req, res) => {
  const user = req.user;
  let status = false;
  let id = null;
  if (user) {
    status = user.userType;
    id = user.username;
  }
  const courses = await Course.find().populate("files");
  res.render("quizPage.ejs", { status, id, courses });

}

const handleGetQuiz = async (req, res) => {
  const user = req.user;
  let status = false;
  let id = null;
  if (user) {
    status = user.userType;
    id = user.username;
  }
  const courseId = req.params.id;
  const course = await Course.findById(courseId).populate("files").populate("quiz");
  res.render("quiz.ejs", { status, id, course });
}

const handlePostCreateQuizQuestion = async (req, res) => {
  const { questionText, options, correctAnswerIndex, courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).send("Course not found");
  }

  // Ensure options is an array
  const formattedOptions = Array.isArray(options) ? options : [options];

  // Create a new question object
  const newQuestion = {
    questionText,
    options: formattedOptions,
    correctAnswerIndex: parseInt(correctAnswerIndex, 10),
  };

  const quiz = await Quiz.create(newQuestion);
  course.quiz.push(quiz._id);
  await course.save();
  res.redirect(`/quiz/${courseId}`);
};

const handlePostDeleteQuizQuestion = async (req, res) => {
  const { quizId, courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).send("Course not found");
  }
  // Remove the question from the course's quiz array
  course.quiz = course.quiz.filter((quizId) => quizId.toString() !== quizId);
  await course.save();

  // Delete the question from the Quiz collection
  await Quiz.findByIdAndDelete(quizId);

  req.session.showResult = true;
  res.redirect(`/quiz/${courseId}`);
} 

const handlePostSubmitQuiz = async (req, res) => {
  try {
    const { courseId, answers } = req.body;

    // Fetch the course along with its quiz questions
    const course = await Course.findById(courseId).populate("quiz");
    if (!course) {
      return res.status(404).send("Course not found");
    }

    let score = 0;
    const totalQuestions = course.quiz.length;

    // Loop through each quiz question and compare the submitted answer
    course.quiz.forEach((question, index) => {
      const userAnswer = answers[index]; // `index` is a number, but keys in `answers` are strings
      if (userAnswer !== undefined && parseInt(userAnswer, 10) === question.correctAnswerIndex) {
        score++;
      }
    });

    const quizResult = await QuizResult.findOne({ course: courseId, user: req.user._id });
    if (quizResult) {
      // Update existing quiz result
      quizResult.correctAnswers = score;
      quizResult.totalQuestions = totalQuestions;
      quizResult.createdAt = Date.now();
      await quizResult.save();
    } else {
      // Create a new quiz result
      const newQuizResult = new QuizResult({
        course: courseId,
        user: req.user._id,
        totalQuestions,
        correctAnswers: score,
      });
      await newQuizResult.save();
    } 

    res.redirect(`/quiz/result/${courseId}`);

  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).send("Internal Server Error");
  }
};

const handleGetQuizResultPage = async (req, res) => {
  const user = req.user;
  let status = false;
  let id = null;
  if (user) {
    status = user.userType;
    id = user.username;
  }
  const courseId = req.params.id;
  const quizResult = await QuizResult.findOne({ course: courseId, user: req.user._id.toString() }).populate("course");
  res.render("quizResult.ejs", { status, id, quizResult });
}


module.exports = {
  handleGetQuizList,
  handleGetQuiz,
  handlePostCreateQuizQuestion,
  handlePostDeleteQuizQuestion,
  handlePostSubmitQuiz,
  handleGetQuizResultPage,
};