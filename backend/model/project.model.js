const mongoose = require('mongoose');
const { type } = require('os');

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["modular_Kitchen", "inPlace_Furniture"],
      required: [true, "Category is required"],
    },
    estimatedBudget: {
      type: String,
      trim: true,
    },
    finalBudget: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startingDate: {
      type: Date,
    },
    projectImages: [
      {
        url: { type: String },
        public_id: { type: String },
      }
    ],
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    salesperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    designer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    carpenter:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    status: {
      type: String,
      enum: ["Pending", "In-Process", "Completed"],
      default: "Pending",
    },
    quotation: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quotation",
      },
    ],
    roughQuotationUploaded: {
      type: Boolean,
      default: false,
    },
    designs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Design",
      },
    ],
    designsUploaded: {
      type: Boolean,
      default: false
    },
    updates: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Update",
      },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", ProjectSchema);
