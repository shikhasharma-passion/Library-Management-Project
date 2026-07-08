const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
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
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      default: null
    },
    date: {
      type: String,
      required: true
    },
    returnDate: {
      type: String,
      required: true
    },
    studentId: {
      type: String,
      trim: true,
      default: ""
    },
    accessionNo: {
      type: String,
      trim: true,
      default: ""
    },
    remarks: {
      type: String,
      trim: true,
      default: ""
    },
    issueType: {
      type: String,
      trim: true,
      default: "Student Online"
    },
    status: {
      type: String,
      enum: ["Active", "Returned", "Overdue"],
      default: "Active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
