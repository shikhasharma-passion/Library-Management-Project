const express = require("express");
const { login, register, googleLogin } = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/google-login", googleLogin);

module.exports = router;
