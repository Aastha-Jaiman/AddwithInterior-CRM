const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Invalid email format"],
  },

  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    match: [/^\d{10}$/, "Phone number must be 10 digits"],
  },

  secondaryPhone: {
    type: String,
    match: [/^\d{10}$/, "Secondary phone number must be 10 digits"],
    default: null,
  },

  profile: {
    url: { type: String },
    public_id: { type: String }
  },

  aadhaarNumber: {
    type: String,
    match: [/^\d{12}$/, "Aadhaar number must be 12 digits"],
    required: true,
  },

  uploadIdProof: {
    url: { type: String },
    public_id: { type: String }
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },

  address: {
    type: String,
    required: [true, "Address is required"],
  },

  role: {
    type: String,
    enum: ["admin", "salesperson", "designer", "carpenter"],
    required: true,
  },

  permission: {
    type: [String],
    enum: [
      "upload_quotation",
      "view_quotations",
      "upload_design",
      "view_design_feedback",
      "upload_daily_updates",
      "view_daily_updates",
      "create_project",
      "manage_users",
      "create_brochures",
      "manage_brochures",    
      "view_client_info",
      "view_invoice",
      "generate_invoice",
    ],
    default: [],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isactive: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

AdminSchema.pre("validate", function (next) {
  if (this.role === "admin") {
    this.permission = [];
  } else if (!this.isVerified) {
    this.permission = [];
  } else if (this.isVerified && (!this.permission || this.permission.length === 0)) {
    return next(new Error("Verified users must have at least one permission."));
  }
  next();
});

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", AdminSchema);
