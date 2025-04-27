const restrictToLoggedinUserOnly = async (req, res, next) => {
  const userUid = req.session.uid;

  if (!userUid) {
    return res.redirect("/auth/login");
  }

  next();
};

module.exports = { restrictToLoggedinUserOnly };
