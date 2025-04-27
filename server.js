const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const crypto = require("crypto");
const session = require("express-session");

const { restrictToLoggedinUserOnly } = require("./middlewares/restrict");
const { setUser } = require("./middlewares/setUser");

const handleProfile = require("./routes/profile");
const handleHome = require("./routes/home");
const handleAuth = require("./routes/auth");
const handleGetProgramCourses = require("./routes/programCourses");
const handleGetQuiz = require("./routes/quiz");
const handleProgress = require("./routes/progress");

mongoose
  .connect("mongodb://127.0.0.1:27017/PLMS")
  .then(() => {
    console.log("MongoDB localhost database connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

app.use(
  session({
    secret: generateSecretKey(),
    resave: false,
    saveUninitialized: true,
  })
);

app.use(setUser);

app.use("/", handleHome);
app.use("/auth", handleAuth);

app.use(restrictToLoggedinUserOnly);

app.use("/profile", handleProfile);
app.use("/program-courses", handleGetProgramCourses);
app.use("/quiz", handleGetQuiz)
app.use("/progress", handleProgress)

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
