const _ = require("lodash");

const User = require("../models/User");

const userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "User not found!" });
    }

    req.profile = user; // has profile obj in req with user info

    next();
  });
};

const hasAuthorization = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id === req.auth._id;
  if (!authorized) {
    res.status(403).json({ error: "User is not authorized for this action!" });
  }
};

const allUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json(users);
  }).select("name email updated created");
};

const getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const updateUser = (req, res, next) => {
  let user = req.profile;
  user = _.extend(user, req.body);
  user.updated = Date.now();
  user.save((err) => {
    if (err) {
      return res
        .status(400)
        .json({ error: "You are not authorized to perform this action" });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    return res.json({ user });
  });
};

const deleteUser = (req, res) => {
  let user = req.profile;
  user.remove((err, user) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    return res.json({ message: "User deleted successfully" });
  });
};

module.exports = {
  userById,
  hasAuthorization,
  allUsers,
  getUser,
  updateUser,
  deleteUser,
};
