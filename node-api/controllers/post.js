const Post = require("../models/Post");
const _ = require("lodash");
const formidable = require("formidable");
require("dotenv").config();
const fs = require("fs");

const postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name")
    //.populate("comments", "text created")
    .populate("comments.postedBy", "_id name")
    .select("_id title body created likes comments photo")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({ error: err });
      }
      console.log(post);
      req.post = post;
      next();
    });
};

const getPosts = async (req, res) => {
  // get current page from req.query or use default value of 1
  const currentPage = req.query.page || 1;
  // return 3 posts per page
  const perPage = 6;
  let totalItems;

  const post = Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return (
        Post.find()
          .skip((currentPage - 1) * perPage)
          .populate("postedBy", "_id name")
          //.populate("comments", "text created")
          .populate("comments.postedBy", "_id name")
          .sort({ created: -1 })
          .limit(perPage)
          .select("_id title body created comments photo likes ")
      );
    })

    .then((posts) => {
      console.log(JSON.stringify(posts));
      res.status(200).json(posts);
    })
    .catch((err) => console.log(err));
};

// const createPost = (req, res, next) => {
//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;

//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       return res.status(400).json({ error: "Image could not be uploaded!" });
//     }
//     let post = new Post(fields);
//     req.profile.hashed_password = undefined;
//     req.profile.salt = undefined;
//     post.postedBy = req.profile;

//     if (files.photo) {
//       post.photo.data = fs.readFileSync(files.photo.path);
//       post.photo.contentType = files.photo.type;
//     }
//     post.save((err, result) => {
//       if (err) {
//         return res.status(400).json({ error: err });
//       }
//       res.json(result);
//     });
//   });
// };

const createPost = async (req, res, next) => {
  // console.log("req.file: ", req.file);
  if (req.file == undefined) {
    return res.status(400).json({ error: "Its required to add a Photo!" });
  }
  const imageNew = {
    photo: await req.file.transforms[0].location,
    title: req.body.title,
    body: req.body.body,
  };
  // console.log(imageNew);

  let post = new Post(imageNew);
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  post.postedBy = req.profile;

  await post.save((err, result) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json(result);
  });
};

const postByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name")
    .select("_id title body created photo likes comments")
    .sort({ created: -1 })
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.json(posts);
    });
};

const isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;

  if (!isPoster) {
    return res.status(403).json({ error: "User is not authorized!!!" });
  }
  next();
};

const updatePost = async (req, res, next) => {
  console.log("REQ POST: ", req.post);

  if (req.file == undefined) {
    return res.status(400).json({ error: "Its required to add a Photo!" });
  }

  // const imageNew = {
  //   photo: await req.file.transforms[0].location,
  //   title: req.body.title,
  //   body: req.body.body,
  // };

  let post = req.post;
  post.photo = await req.file.transforms[0].location;
  console.log("next post: ", post);
  post = _.extend(post, req.body);
  post.updated = Date.now();
  post.save((err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json(post);
  });
};

const deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    res.json({ message: "Post deleted successfully!" });
  });
};

const photo = (req, res, next) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
  next();
};

const singlePost = (req, res) => {
  return res.json(req.post);
};

const like = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.body.userId },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      res.json(result);
    }
  });
};

const unlike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.body.userId },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      res.json(result);
    }
  });
};

const comment = (req, res) => {
  let comment = req.body.comment;
  comment.postedBy = req.body.userId;

  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        res.json(result);
      }
    });
};

const uncomment = (req, res) => {
  let comment = req.body.comment;

  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { comments: { _id: comment._id } },
    },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        res.json(result);
      }
    });
};

module.exports = {
  getPosts,
  createPost,
  postByUser,
  postById,
  isPoster,
  deletePost,
  updatePost,
  photo,
  singlePost,
  like,
  unlike,
  comment,
  uncomment,
};
