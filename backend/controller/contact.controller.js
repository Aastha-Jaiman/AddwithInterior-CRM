const ContactModel = require('../model/contact.model');


exports.addContact = async (req, res) => {
      try{
            const { name, email,phone, subject, message } = req.body;

            if (!name || !email || !subject || !message) {
                  return res.status(400).json({ message: "All fields are required" });
            }

            const newContact = new ContactModel({
                  name,
                  email,
                  phone,
                  subject,
                  message
            });

            await newContact.save();
            return res.status(201).json({
                  message: "Contact message sent successfully",
                  contact: newContact
            });

      }catch(error){
            console.error(error);
            return res.status(500).json({ message: "Server error" });
      }

}