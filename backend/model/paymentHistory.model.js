const mongoose = require("mongoose");

const PaymentHistorySchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client reference is required"],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project reference is required"],
    },

    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },

    totalReceived: {
      type: Number,
      default: 0,
      min: [0, "Total received cannot be negative"],
    },

    pending: {
      type: Number,
      default: function () {
        return this.totalPrice - this.totalReceived;
      },
      min: [0, "Pending amount cannot be negative"],
    },

    payments: [
      {
        amount: {
          type: Number,
          required: [true, "Payment amount is required"],
          min: [0, "Amount cannot be negative"],
        },
        message: {
          type: String,
          trim: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        file: { type: String, trim: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PaymentHistory", PaymentHistorySchema);
