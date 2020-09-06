const express = require("express");
require("dotenv").config();
const aws = require("aws-sdk"); //"^2.2.41"
const multer = require("multer"); // "^1.3.0"
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");
const {
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
} = require("../controllers/post");
const { userById } = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");
const { createPostValidator, checkFile } = require("../validator/index");

const router = express.Router();

//AWS
aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype));
    },

    key: async function (req, file, cb) {
      console.log("This is the file: ", file);
      let date = await Date.now();
      cb(null, date + file.originalname); //use Date.now() for unique file keys
    },
    transforms: [
      {
        id: "thumbnail",
        key: async function (req, file, cb) {
          // console.log("title: ", file);
          let date = await Date.now();
          cb(null, date + file.originalname);
        },
        transform: function (req, file, cb) {
          cb(
            null,
            sharp()
              .resize(400)
              .webp({ lossless: true, quality: 100, alphaQuality: 80 })
          );
        },
      },
    ],
  }),
});
//AWS END

router.get("/posts", getPosts);
//like unlike
router.put("/post/like", requireSignin, like);
router.put("/post/unlike", requireSignin, unlike);

//comment uncomment
router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);

//photo
router.get("/post/photo/:photoId", photo);

router.get("/posts/by/:userId", requireSignin, postByUser);
router.get("/post/:postId", singlePost);
router.put(
  "/post/:postId",
  upload.single("photo"),
  requireSignin,
  isPoster,
  updatePost
);

router.delete("/post/:postId", requireSignin, isPoster, deletePost);
router.post(
  "/post/new/:userId",
  upload.single("photo"),
  requireSignin,
  createPost,
  createPostValidator
);

router.param("userId", userById);
router.param("postId", postById);

module.exports = router;
