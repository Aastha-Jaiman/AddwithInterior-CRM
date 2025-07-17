const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\d{10}$/, "Phone number must be 10 digits"],
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Contact', ContactSchema);
// module.exports = Contact;