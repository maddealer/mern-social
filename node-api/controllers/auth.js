const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

const signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(403).json({
      error: "Email is taken!",
    });
  }

  const user = new User(req.body);
  await user.save();
  res.status(200).json({ message: "Signup success! Please login." });
};

const signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    //if err or no user
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist. Please signup.",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match!",
      });
    }

    //generate token with user id and jwt secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.cookie("mycookie", token, { expire: new Date() + 9999 });

    const { _id, name, email } = user;

    return res.json({ token, user: { _id, name, email } });
  });
};

const signout = (req, res) => {
  res.clearCookie("mycookie");
  return res.json({ message: "Signout success!" });
};

module.exports = {
  signup,
  signin,
  signout,
};
