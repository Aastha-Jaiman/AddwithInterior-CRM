const ContactModel = require('../model/contact.model');


exports.addContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;


    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const contact = await ContactModel.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully!",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while submitting contact form.",
      error: error.message,
    });
  }
};

exports.getAllContact = async (req, res) => {
      try{
            const userRole = req.user.role;

            if(!["admin"].includes(userRole)){
                  return res.status(401).json({message: "Only admin can get all contact data."})
            }

            const contact = await ContactModelc.find();

            if(!contact){
                  return res.status(400).json({message: "Can not found contact."})
            }

            res.status(200).json({
                  success: true,
                  message: "Fetch All Data Successfully.",
                  contact
            })

      }catch(error){
            return res.status(500).json({message: "Server Error.", error: error.message})
      }
}

exports.getbyId = async (req, res) => {
      try{
            const {id} = req.params;
            const userRole = req.user.role;

             if(!["admin"].includes(userRole)){
                  return res.status(401).json({message: "Only admin can get contact data."})
            }

            const contact = await ContactModel.findById(id);

             if(!contact){
                  return res.status(400).json({message: "Can not found contact."})
            }

              res.status(200).json({
                  success: true,
                  message: "Fetch Data Successfully.",
                  contact
            })


      }catch(error){
            return res.status(500).json({message: "Server Error.", error: error.message})

      }
}