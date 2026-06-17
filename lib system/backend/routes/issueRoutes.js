const express = require("express");
const { getIssues, createIssue, returnBook } = require("../controllers/issueController");

const router = express.Router();

router.get("/", getIssues);
router.post("/", createIssue);
router.delete("/:id", returnBook);

module.exports = router;
