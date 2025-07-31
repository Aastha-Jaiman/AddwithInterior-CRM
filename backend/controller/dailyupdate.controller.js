const UpdateModel = require("../model/dailyupdate.model");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const fs = require("fs");
const Jwt = require('jsonwebtoken')


exports.addUpdates = async (req, res) => {
  try {
    const { project, type, message } = req.body;
    const uploadedBy = req.user._id;

    if (!project || !type) {
      return res.status(400).json({ message: "Project and type are required" });
    }

    let images = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await uploadOnCloudinary(file.path, {
          folder: "updates",
        });

        images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });

        
            if (fs.existsSync(req.file.path)) {
              fs.unlinkSync(req.file.path);
            }
      }
    }

    const newUpdate = await UpdateModel.create({
      project,
      uploadedBy,
      type,
      message,
      images,
    });

    return res.status(201).json({ success: true, update: newUpdate });
  } catch (error) {
    console.error("Add update error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
