const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");

function safeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    course: user.course,
    username: user.username,
    role: user.role
  };
}

function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET || "library_secret_key",
    {
      expiresIn: "1d"
    }
  );
}

async function ensureAdminUser() {
  const admin = await User.findOne({ username: "admin" });

  if (admin) {
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Admin",
    email: "admin@library.com",
    course: "Admin",
    username: "admin",
    password: hashedPassword,
    role: "admin"
  });
}

async function register(req, res) {
  try {
    const { name, email, course, password } = req.body;

    if (!name || !email || !course || !password) {
      res.status(400).json({ success: false, message: "Please fill all fields" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ email: normalizedEmail });

    if (exists) {
      res.status(409).json({ success: false, message: "Account already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      course: course.trim(),
      username: normalizedEmail,
      password: hashedPassword,
      role: "student"
    });

    await Student.create({
      name: user.name,
      course: user.course,
      roll: req.body.roll || `LIB-${Date.now()}`
    });

    res.status(201).json({
      success: true,
      user: safeUser(user),
      token: createToken(user)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function login(req, res) {
  try {
    await ensureAdminUser();

    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ success: false, message: "Please fill all fields" });
      return;
    }

    const normalizedUsername = username.trim().toLowerCase();

    const user = await User.findOne({
      $or: [
        { username: normalizedUsername },
        { email: normalizedUsername }
      ]
    });

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid username or password" });
      return;
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      res.status(401).json({ success: false, message: "Invalid username or password" });
      return;
    }

    res.json({
      success: true,
      user: safeUser(user),
      token: createToken(user)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  register,
  login,
  ensureAdminUser
};