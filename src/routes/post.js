const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const PostsController = require('../controllers/PostController')
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


router.get("/",  PostsController.show)
router.post("/create", auth ,upload.single("image"),PostsController.create)
router.get("/detail/:id", PostsController.detail)
router.put("/detail/:id", PostsController.addComment)

module.exports = router
