const mongoose = require("mongoose");
// bring post model on top
const Post = require("./Post");
//const uuidv1 = require("uuid/v1");
const { v1: uuidv1 } = require("uuid");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now(),
  },
  updated: Date,
  photo: {
    data: Buffer,
    contentType: String,
  },
  about: {
    type: String,
    trim: true,
  },
  resetPasswordLink: {
    data: String,
    default: "",
  },
  following: [{ type: ObjectId, ref: "User" }],
  followers: [{ type: ObjectId, ref: "User" }],
});

//virtual field
UserSchema.virtual("password")
  .set(function (password) {
    //create temporaty variable called _password
    this._password = password;
    //generate salt
    this.salt = uuidv1();
    //encryptPassword
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

// pre middleware
UserSchema.pre("remove", function (next) {
  Post.remove({ postedBy: this._id }).exec();
  next();
});

module.exports = mongoose.model("User", UserSchema);
