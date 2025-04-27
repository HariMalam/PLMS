const mongoose = require("mongoose");

const quizResultSchema = mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const QuizResult = mongoose.model("quizResult", quizResultSchema);

module.exports = QuizResult;
