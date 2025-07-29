const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Client name is required"],
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
    match: [/^\d{10}$/, "Phone number must be 10 digits"],
  },

  address: [
  {
    addressinfo: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      pincode: {
        type: String,
        required: true,
        match: [/^\d{5,6}$/, 'Invalid pincode']
      }
    },
    addresstype: {
      type: String,
      enum: ['home', 'work', 'other'],
      required: true
    }
  }
],

  profile: {
    url: { type: String,},
    public_id: { type: String,},
    initials: { type: String }
  },
  aadharCardNumber: {
      type: String,
      match: [/^\d{12}$/, "Aadhar must be a 12-digit number"],
    },
    idProof: {
      url: { type: String },
      public_id: { type: String },
    },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false, 
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },

  quotation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quotation",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });


ClientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


ClientSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Client", ClientSchema);
