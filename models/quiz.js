const mongoose = require("mongoose");

const quizSchema = mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [String], // Array of strings for the options
      validate: {
        validator: function (v) {
          return v.length === 4; // Ensure exactly 4 options
        },
        message: "There must be exactly 4 options.",
      },
      required: true,
    },
    correctAnswerIndex: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v >= 0 && v < 4; // Ensure the index is between 0 and 3
        },
        message: "Correct answer index must be between 0 and 3.",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("quiz", quizSchema);

module.exports = Quiz;
