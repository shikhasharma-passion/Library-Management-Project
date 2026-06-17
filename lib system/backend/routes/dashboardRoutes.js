const express = require("express");
const { getStats, getStudentDashboard } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/stats", getStats);
router.get("/student-dashboard", getStudentDashboard);

module.exports = router;
