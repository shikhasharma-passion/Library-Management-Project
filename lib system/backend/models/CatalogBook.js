const mongoose = require("mongoose");

const catalogBookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    publisher: {
      type: String,
      default: "Tata McGraw Hill",
      trim: true
    },
    edition: {
      type: String,
      default: "1st Edition",
      trim: true
    },
    isbn: {
      type: String,
      default: "N/A",
      trim: true
    },
    subjectCode: {
      type: String,
      default: "N/A",
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    semester: {
      type: String,
      default: "N/A",
      trim: true
    },
    rackNo: {
      type: String,
      default: "R-1",
      trim: true
    },
    shelfNo: {
      type: String,
      default: "S-1",
      trim: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    availableCopies: {
      type: Number,
      default: 1
    },
    issuedCopies: {
      type: Number,
      default: 0
    },
    language: {
      type: String,
      default: "English",
      trim: true
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    pubYear: {
      type: String,
      default: "2024",
      trim: true
    },
    department: {
      type: String,
      default: "General",
      trim: true
    },
    description: {
      type: String,
      default: "No description available.",
      trim: true
    },
    rating: {
      type: Number,
      default: 4.5
    },
    reviews: [
      {
        studentName: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("CatalogBook", catalogBookSchema);
