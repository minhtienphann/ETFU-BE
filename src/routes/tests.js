const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const testsController = require("../controllers/TestsController");
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

router.get("/show", testsController.show);

router.get("/getAll", testsController.getAll);

router.post("/create", upload.single("image"), testsController.create);

router.delete("/delete/:id", authAdmin, testsController.delete);

router.put("/update/:id", upload.single("image"), testsController.update);

module.exports = router;
