const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project reference is required"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Uploader (Admin) is required"],
    },
    type: {
      type: String,
      enum: ["rough", "final"],
      required: [true, "Quotation type is required"],
    },
    items: [
      {
        title: {
          type: String,
          required: [true, "Item title is required"],
          trim: true,
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        rate: {
          type: Number,
          required: [true, "Rate is required"],
          min: [0, "Rate cannot be negative"],
        },
        total: {
          type: Number,
          required: [true, "Total is required"],
          min: [0, "Total cannot be negative"],
        },
      },
    ],
    grandTotal: {
      type: Number,
      required: [true, "Grand total is required"],
      min: [0, "Grand total cannot be negative"],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    pdfUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quotation", QuotationSchema);
