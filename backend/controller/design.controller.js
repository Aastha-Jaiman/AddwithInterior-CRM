const DesignModel = require("../model/design.model");
const fs = require("fs")
const { uploadOnCloudinary } = require("../utils/cloudinary");

const uploadDesign = async (req, res) => {
      try {

            const { project, version, feedback } = req.body;
            const file = req.file;

            if (!project || !version || !file) {
                  return res.status(400).json({ message: "Project, version, and PDF are required." });
            }

            const uploadResult = await uploadOnCloudinary(file.path,{
                  resource_type: "raw",
                  folder: "project_design"
            })

            if (fs.existsSync(file.path)) {
                  fs.unlinkSync(file.path);
            }

            const newdesign = await DesignModel({
                  project,
                  version,
                  feedback,
                  uploadedBy: req.user?._id,
                  pdfUrl: uploadResult.secure_url
            })

            await newdesign.save();

            es.status(200).json({
                  message: "Design uploaded successfully",
                  design: newdesign
            });

      } catch (error) {
            return res.status(500).json({ message: "Server Error.", error: error.message })
      }
}