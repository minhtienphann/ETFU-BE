const express = require("express");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const router = express.Router();
const questionsController = require("../controllers/QuestionsController");

router.get("/show", questionsController.show);

router.get("/getAll", questionsController.getAll);

router.post("/create", questionsController.create);

router.delete("/delete/:id", questionsController.delete);

router.put("/update/:id", questionsController.update);

module.exports = router;
