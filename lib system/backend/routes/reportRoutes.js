const express = require("express");
const { exportExcel, exportPdf } = require("../controllers/reportController");

const router = express.Router();

router.get("/excel", exportExcel);
router.get("/pdf", exportPdf);

module.exports = router;
