const User = require("../models/user");

const handleGetProfile = async (req, res) => {
  const username = req.params.user;
  const user = await User.findOne({ username });
  const users = req.user;
  let status = false;
  let id = null;
  if (user) {
    status = user.userType;
    id = user.username;
  }
  res.render("profile.ejs", { status, user, id, username: users.username });
};

const handlePostEdit = async (req, res) => {
  const username = req.user.username;
  const userData = req.body;
  const result = await User.updateOne({ username }, { $set: userData });
  res.redirect(`/profile/${req.user.username}`);
};

const handlePostUpload = async (req, res) => {
  const username = req.user.username;
  if (!req.file) {
    return res.status(400).send("No files were uploaded.");
  }
  const resume = req.file.filename;
  const result = await User.updateOne({ username }, { resume });
  res.redirect(`/profile/${req.user.username}`);
};
module.exports = { handleGetProfile, handlePostEdit, handlePostUpload };
