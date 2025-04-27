const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "files",
      },
    ],
    quiz: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quiz",
      }
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model("course", courseSchema);

module.exports = Course;
