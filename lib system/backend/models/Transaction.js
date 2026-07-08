const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true
    },
    userName: {
      type: String,
      required: true,
      trim: true
    },
    actionType: {
      type: String,
      enum: ["Issue", "Return", "Renew", "Reserve", "Cancel Reservation", "Fine Payment"],
      required: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    accessionNo: {
      type: String,
      trim: true,
      default: ""
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
