const mongoose = require("mongoose");

const UpdateSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project reference is required"],
    },
    dailyUpdates: [
      {
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Admin",
          required: [true, "Uploader is required"],
        },
        type: {
          type: String,
          enum: ["morning", "evening"],
          required: [true, "Type (morning/evening) is required"],
        },
        message: {
          type: String,
          trim: true,
        },
        images: [
          {
            url: { type: String },
            public_id: { type: String },
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Update", UpdateSchema);
