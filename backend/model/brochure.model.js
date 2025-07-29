const mongoose = require("mongoose");

const BrochureSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["modular_kitchen", "furniture", "doors_windows"],
      required: [true, "Category is required"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
    },
    pdfUrl: {
      type: String,
      trim: true,
      required: [true, "PDF URL is required"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Uploader is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Brochure", BrochureSchema);
