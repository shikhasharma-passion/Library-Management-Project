const express = require("express");
const router = express.Router();
const digitalBookController = require("../controllers/digitalBookController");

router.get("/", digitalBookController.getDigitalBooks);
router.get("/:id", digitalBookController.getDigitalBookById);
router.post("/:id/read", digitalBookController.incrementReadCount);

module.exports = router;
