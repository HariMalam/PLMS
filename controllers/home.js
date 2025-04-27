const handleGetHome = (req, res) => {
  const user = req.user;
  let status = false;
  let id = null;
  if (user) {
    status = user.userType;
    id = user.username;
  }
  res.render("home.ejs", {status,id});
};

module.exports = { handleGetHome };