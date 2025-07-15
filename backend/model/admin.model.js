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

  profile: {
    url: { type: String},
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
      // Salesperson Permissions
      "upload_quotation",
      "view_quotations",

      // Designer Permissions
      "upload_design",
      "view_design_feedback",

      // Carpenter Permissions
      "upload_morning_update",
      "upload_evening_update",
      "view_daily_updates",

      // Admin Permissions (frontend-controlled)
      "create_project",
      "assign_team",
      "manage_users",
      "manage_brochures",
      "see_all_projects",

      // Common Permissions
      "view_client_info",
      "view_payment",
      "generate_invoice",

      // Service Tracker
      "assign_service",
      "track_service",
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


//  Permission logic
AdminSchema.pre("validate", function (next) {
  // Admin gets full access — skip permission requirement
  if (this.role === "admin") {
    this.permission = [];
  }

  // Unverified users can’t have any permission
  else if (!this.isVerified) {
    this.permission = [];
  }

  // Verified non-admins must have at least one permission
  else if (this.isVerified && (!this.permission || this.permission.length === 0)) {
    return next(new Error("Verified users must have at least one permission."));
  }

  next();
});

//  Hash password
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//  Compare password (for login)
AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", AdminSchema);
