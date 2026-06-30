const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema(
  {
    student: {
      type: String,
      required: true,
      trim: true
    },
    bookTitle: {
      type: String,
      required: true,
      trim: true
    },
    bookAuthor: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Accepted - On the Way", "Accepted - Added", "Refused"]
    },
    adminNotes: {
      type: String,
      default: ""
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Suggestion", suggestionSchema);
