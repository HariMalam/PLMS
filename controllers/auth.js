const User = require("../models/user");
const bcrypt = require("bcrypt");

const handleGetLogin = (req, res) => {
  const invalid = req.session.invalid || false;
  const success = req.session.success || false;
  delete req.session.invalid;
  delete req.session.success;
  const user = req.user;
  let status = false;
  let id = null;
  if (user) {
    status = true;
    id = user.username;
  }
  res.render("login", { invalid, success, status, id });
};

const handleGetSignup = (req, res) => {
  const error = req.session.error || "";
  delete req.session.error;
  const user = req.user;
  let status = false;
  let id = null;
  if (user) {
    status = true;
    id = user.username;
  }
  res.render("signup", { status, id, error });
};

const handlePostLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      req.session.invalid = true;
      req.session.success = false;
      return res.redirect("/login");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      req.session.invalid = true;
      req.session.success = false;
      return res.redirect("/login");
    }

    req.session.uid = user._id;

    return res.redirect("/");
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const handlePostSignup = async (req, res) => {
  const { name, username, mobile, email, password, gender, dob, address } =
    req.body;

  const existingUser = await User.findOne({ username: username.trim() });
  if (existingUser) {
    const error = "username already exists";
    req.session.error = error;
    return res.redirect("/auth/signup");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name,
    username: username.trim(),
    mobile,
    email,
    password: hashedPassword,
    gender,
    dob,
    address,
  });

  req.session.success = true;
  return res.redirect("/login");
};

const handleLogout = (req, res) => {
  delete req.session.uid;
  req.user = null;
  res.redirect("/");
};

module.exports = {
  handleGetLogin,
  handleGetSignup,
  handlePostSignup,
  handlePostLogin,
  handleLogout,
};
