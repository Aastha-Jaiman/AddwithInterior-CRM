const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project reference is required"],
      unique: true
    },
    client: {
       type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client email is required"],
    },
    category: {
      type: String,
      enum: ["modular_Kitchen", "inPlace_Furniture"],
      required: [true, "Category is required"],
    },
    type: {
      type: String,
      enum: ["rough"],
      required: [true, "Quotation type is required"],
    },

    sections: [
      {
        sectionName: {
          type: String,
          required: [true, "Section name is required"],
          trim: true,
        },
        items: [
          {
            itemName: {
              type: String,
              required: [true, "Item name is required"],
              trim: true,
            },
            height: {
              type: Number,
              default: 0,
              min: [0, "Height cannot be negative"],
            },
            width: {
              type: Number,
              default: 0,
              min: [0, "Width cannot be negative"],
            },
            calculation: {
              type: String, 
              required: [true, "Calculation is required"],
              trim: true,
            },
            total: {
              type: Number,
              required: [true, "Total is required"],
              min: [0, "Total cannot be negative"],
            },
          },
        ],
        sectionTotal: {
          type: Number,
          required: [true, "Section total is required"],
          min: [0, "Section total cannot be negative"],
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
    finaldocument: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quotation", QuotationSchema);
