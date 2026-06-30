const express = require("express");
const router = express.Router();
const controller = require("../controllers/suggestionController");

router.post("/", controller.createSuggestion);
router.get("/", controller.getSuggestions);
router.get("/student", controller.getStudentSuggestions);
router.put("/:id", controller.updateSuggestionStatus);

module.exports = router;
