const express = require("express");
const { getStudents, createStudent, deleteStudent, getRecentLogins } = require("../controllers/studentController");

const router = express.Router();

router.get("/recent-logins", getRecentLogins);
router.get("/", getStudents);
router.post("/", createStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
