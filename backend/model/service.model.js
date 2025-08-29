const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
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
    startDate: {
      type: Date,
      default: Date.now,
    },
    durationYears: {
      type: Number,
      required: true,
    },
    allowedVisits: {
      type: Number,
      required: true,
    },
    usedVisits: {
      type: Number,
      default: 0,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    visits: [
      {
        visitDate: { type: Date, default: Date.now },
        remarks: { type: String, trim: true },
      },
    ],
  },
  { timestamps: true }
);

ServiceSchema.pre("save", function (next) {
  const now = new Date();
  if (this.usedVisits >= this.allowedVisits) {
    this.isExpired = true;
  }
  const expiryDate = new Date(this.startDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + this.durationYears);
  if (now >= expiryDate) {
    this.isExpired = true;
  }
  next();
});

module.exports = mongoose.model("Service", ServiceSchema);
