const DesignModel = require("../model/design.model");
const fs = require("fs");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const ProjectModel = require("../model/project.model");

exports.uploadDesign = async (req, res) => {
  try {
    const { message } = req.body;
    const { projectId } = req.params;
    const file = req.file;
    const uploadedBy = req.user._id;

    if (!file) {
      return res.status(400).json({
        message: "PDF file is required.",
      });
    }

    let pdfData;
    try {
      pdfData = await uploadOnCloudinary(file.path, {
        resource_type: "raw",
        folder: "designs",
      });

      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (uploadErr) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      return res.status(500).json({
        message: "Failed to upload PDF to Cloudinary.",
      });
    }

    let designDoc = await DesignModel.findOne({ project: projectId });
    let version = 1;

    if (designDoc) {
      const lastVersion =
        designDoc.pdfs.length > 0
          ? designDoc.pdfs[designDoc.pdfs.length - 1].version
          : 0;
      version = lastVersion + 1;

      designDoc.pdfs.push({
        pdfUrl: pdfData.secure_url,
        message,
        uploadedBy,
        version,
      });

      await designDoc.save();
    } else {
      designDoc = await DesignModel.create({
        project: projectId,
        pdfs: [
          {
            pdfUrl: pdfData.secure_url,
            message,
            uploadedBy,
            version,
          },
        ],
      });
    }

    await ProjectModel.findByIdAndUpdate(projectId, {
      $addToSet: { designs: designDoc._id },
      designsUploaded: true,
    });

    res.status(201).json({
      message: "Design uploaded successfully",
      design: designDoc,
    });
  } catch (error) {
    console.error("Upload design error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getDesignsByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    const design = await DesignModel.findOne({ project: projectId })
      .populate("pdfs.uploadedBy", "name email") 
      .populate("project", "title"); 

    if (!design) {
      return res.status(404).json({ message: "No designs found for this project." });
    }

    res.status(200).json({
      message: "Designs fetched successfully",
      pdfs: design.pdfs,
      project: design.project,
    });
  } catch (error) {
    console.error("Error fetching designs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllDesigns = async (req, res) => {
  try {
    const designs = await DesignModel.find()
      .populate("project", "title _id")
      .populate("pdfs.uploadedBy", "name email"); 

    if (!designs || designs.length === 0) {
      return res.status(404).json({ message: "No designs found." });
    }

    res.status(200).json({
      message: "All designs fetched successfully",
      total: designs.length,
      designs,
    });
  } catch (error) {
    console.error("Error fetching all designs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addFeedbackToDesign = async (req, res) => {
  try {
    const { designId } = req.params;
    const { isApproved, feedbackMessage, versionSelect } = req.body;

    if (
      typeof isApproved !== "boolean" ||
      !feedbackMessage ||
      typeof versionSelect !== "number"
    ) {
      return res.status(400).json({ error: "Invalid or missing fields" });
    }

    const design = await DesignModel.findById(designId);
    if (!design) {
      return res.status(404).json({ error: "Design not found" });
    }

    design.approvalHistory.push({
      isApproved,
      feedbackMessage,
      versionSelect,
    });

    await design.save();

    res.status(200).json({ message: "Feedback added successfully", design });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ error: "Server error" });
  }
};
