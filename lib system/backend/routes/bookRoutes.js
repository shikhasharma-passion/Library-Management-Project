const express = require("express");
const { getBooks, createBook, deleteBook } = require("../controllers/bookController");

const router = express.Router();

router.get("/", getBooks);
router.post("/", createBook);
router.delete("/:id", deleteBook);

module.exports = router;
