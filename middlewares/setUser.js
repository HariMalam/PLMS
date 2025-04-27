const User = require("../models/user");

const setUser = async (req, res, next) => {
  const userUid = req.session.uid;

  if (userUid) {
    const user = await User.findOne({ _id: userUid });
    req.user = user;
  }

  next();
};

module.exports = { setUser };
