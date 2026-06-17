const express = require("express");
const { getCatalogBooks, addBookReview } = require("../controllers/catalogController");

const router = express.Router();

router.get("/", getCatalogBooks);
router.post("/:id/review", addBookReview);

module.exports = router;

