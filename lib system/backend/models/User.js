const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    course: {
      type: String,
      default: "Student",
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "librarian", "student", "faculty"],
      default: "student"
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    memberId: {
      type: String,
      trim: true,
      default: ""
    },
    lastLoginAt: {
      type: Date,
      default: null
    },
    loginMethod: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
