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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
