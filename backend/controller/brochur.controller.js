const BrochureModel = require("../model/brochure.model");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const fs = require("fs");

exports.addBrochure = async (req, res) => {
      try {
            const { title, category, keywords } = req.body;
            const file = req.file;

            if (!title || !category || !file) {
                  return res.status(400).json({
                        message: "Title, category, and document (PDF) are required.",
                  });
            }

            let brochurePdf;

            try {
                  brochurePdf = await uploadOnCloudinary(file.path, {
                        resource_type: "raw",
                        folder: "brochures",
                  });

                  if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                  }
            } catch (uploadErr) {
                  if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                  }

                  return res.status(500).json({
                        message: "Failed to upload document to Cloudinary",
                  });
            }

            const newBrochure = new BrochureModel({
                  title,
                  category,
                  document: brochurePdf.secure_url,
                  keywords: keywords
                        ? keywords.split(",").map((k) => k.trim())
                        : [],
                  fileSize: file.size
            });

            await newBrochure.save();

            res.status(201).json({
                  message: "Brochure uploaded successfully",
                  brochure: newBrochure,
            });
      } catch (error) {
            console.error("Error uploading brochure:", error);
            res.status(500).json({ message: "Internal server error" });
      }
};

exports.getAllBrochure = async (req, res) => {
      try {

            const brochures = await BrochureModel.find();

            if (!brochures) {
                  return res.status(400).json({
                        message: "Brochures Not Found.",
                  });
            };

            res.status(200).json({
                  message: "Fetch Successfully.",
                  success: true,
                  brochures
            })

      } catch (error) {
            return res.status(500).json({ message: "Server Error.", error: error.message })
      }
}

exports.getBrochureByid = async (req, res) => {
      try {
            const { id } = req.params;

            const brochure = await BrochureModel.findById(id);

            if (!brochure) {
                  return res.status(400).json({
                        message: "Brochures Not Found.",
                  });
            };

            res.status(200).json({
                  message: "Fetch Successfully.",
                  success: true,
                  brochure
            })

      } catch (error) {
            return res.status(500).json({ message: "Server Error.", error: error.message })
      }
}

exports.deleteBrochureByid = async (req, res) => {
      try {
            const { id } = req.params;

            const brochure = await BrochureModel.findById(id);

            if (!brochure) {
                  return res.status(400).json({
                        message: "Brochures Not Found.",
                  });
            };

            await BrochureModel.findByIdAndDelete(id);

            res.status(200).json({
                  message: "Delete Successfully.",
                  success: true,
            })

      } catch (error) {
            return res.status(500).json({ message: "Server Error.", error: error.message })
      }
}

exports.updateBrochure = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, keywords } = req.body;
    const file = req.file;

    const brochure = await BrochureModel.findById(id);
    if (!brochure) {
      return res.status(404).json({ message: "Brochure not found" });
    }

    if (title) brochure.title = title;
    if (category) brochure.category = category;
    if (keywords) {
      brochure.keywords = keywords.split(",").map((k) => k.trim());
    }

    if (file) {
      try {
        const uploaded = await uploadOnCloudinary(file.path, {
          resource_type: "raw",
          folder: "brochures",
        });

        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }

        brochure.document = uploaded.secure_url;
      } catch (uploadErr) {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }

        return res.status(500).json({
          message: "Failed to upload new document to Cloudinary",
        });
      }
    }

    await brochure.save();

    res.status(200).json({
      message: "Brochure updated successfully",
      brochure,
    });
  } catch (error) {
    console.error("Error updating brochure:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};