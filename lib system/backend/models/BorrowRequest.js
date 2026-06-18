const mongoose = require("mongoose");

const borrowRequestSchema = new mongoose.Schema(
  {
    student: {
      type: String,
      required: true,
      trim: true
    },
    book: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    },
    requestDate: {
      type: String,
      required: true
    },
    returnDate: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BorrowRequest", borrowRequestSchema);
