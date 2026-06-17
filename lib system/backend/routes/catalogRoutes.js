const express = require("express");
const { getCatalogBooks } = require("../controllers/catalogController");

const router = express.Router();

router.get("/", getCatalogBooks);

module.exports = router;
