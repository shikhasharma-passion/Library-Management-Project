const mongoose = require("mongoose");

const digitalBookSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    stream: {
      type: String,
      required: true,
      trim: true
    },
    semester: {
      type: String,
      default: "N/A",
      trim: true
    },
    fullBookUrl: {
      type: String,
      trim: true
    },
    chapters: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
        quiz: [
          {
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            answerIndex: { type: Number, required: true }
          }
        ]
      }
    ],
    readCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DigitalBook", digitalBookSchema);
