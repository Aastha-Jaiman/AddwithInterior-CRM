const mongoose = require('mongoose');

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

    status: {
      type: String,
      enum: ["Pending", "Active", "In-Process" ,"Completed"],
      default: "Pending",
    },

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
    carpenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    quotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation",
    },
    designs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Design",
      },
    ],
    updates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Update",
      },
    ],
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Project", ProjectSchema);
