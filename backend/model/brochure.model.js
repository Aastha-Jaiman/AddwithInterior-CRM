const mongoose = require("mongoose");

const BrochureSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["modular_kitchen", "inPlace_Furniture"],
      required: [true, "Category is required"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
    },
    document: {
      type: String,
      trim: true,
      required: [true, "Document URL is required"],
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    keywords: {
      type: [String],
      default: [],
    },
     fileSize: {
      type: Number,
      default: 0
    }

  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Brochure", BrochureSchema);
