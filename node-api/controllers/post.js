const Post = require("../models/Post");

const getPosts = (req, res) => {
  Post.find()
    .select("_id title body")
    .then((posts) => {
      res.status(200).json({
        posts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const createPost = (req, res) => {
  const post = new Post(req.body);

  // console.log("my post", req.body);

  post.save().then((result) => {
    res.status(200).json({
      post: result,
    });
  });
};

module.exports = {
  getPosts,
  createPost,
};
