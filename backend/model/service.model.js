const mongoose = require("mongoose");

const ServiceHistorySchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    type: {
      type: String,
      enum: ["free", "paid"],
      required: true,
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
      trim: true,
    },
    visitMode: {
      type: String,
      enum: ["free_visit", "paid_visit"],
      default: "free_visit",
    },
    totalAllowedVisits: {
      type: Number,
      default: function () {
        return this.type === "free" ? 3 : 10;
      },
    },
    visitNumber: {
      type: Number,
      required: true,
    },
    reducedFromYear: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceHistory", ServiceHistorySchema);
