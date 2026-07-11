const mongoose = require("mongoose");

const loginLogSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    loginMethod: {
      type: String,
      required: true
    },
    loginAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoginLog", loginLogSchema);
