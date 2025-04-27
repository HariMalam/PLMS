const QuizResult = require("../models/quizResult");

const handleGetProgress = async (req, res) => {
  const user = req.user;
  let status = false;
  let id = null;
  if (user) {
    status = user.userType;
    id = user.username;
  }
  let results = null;
  if (req.user.userType === "admin") {
    results = await QuizResult.find().populate("course").populate("user");
  } else {
    results = await QuizResult.find({ user: req.user._id }).populate("course").populate("user");
  }
  console.log(results);
  res.render("progress.ejs", { status, id, results });
}

module.exports = {  
  handleGetProgress
};