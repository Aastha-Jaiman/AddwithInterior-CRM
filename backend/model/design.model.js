const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project reference is required"],
    },

    pdfs: [
      {
        pdfUrl: {
          type: String,
          required: true,
          trim: true,
        },
        message: {
          type: String,
          trim: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Admin",
        },
        version: {
          type: Number,
          required: true,
        },
      },
    ],

    isApproved: {
      type: Boolean,
      default: false,
    },

    feedback: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Design", DesignSchema);
