const UpdateModel = require("../model/dailyupdate.model");
const ProjectModel = require("../model/project.model");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const fs = require("fs");

exports.addUpdate = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { type, message } = req.body;
    const uploadedBy = req.user._id;

    if (!type || !message) {
      return res.status(400).json({ error: "message and type are required." });
    }

    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadOnCloudinary(file.path);
        if (result) {
          uploadedImages.push({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    // 🔹 Check if update exists for this project
    let existingUpdate = await UpdateModel.findOne({ project: projectId });

    if (existingUpdate) {
      // Add new daily update
      existingUpdate.dailyUpdates.push({
        uploadedBy,
        type,
        message,
        images: uploadedImages,
      });

      await existingUpdate.save();

      // 🔹 Set update id into project
      await ProjectModel.findByIdAndUpdate(projectId, {
        $set: { updates: existingUpdate._id }
      });

      return res.status(200).json({
        success: true,
        message: "Daily update added to existing project update",
        data: existingUpdate,
      });
    } else {
      // Create new update
      const newUpdate = await UpdateModel.create({
        project: projectId,
        dailyUpdates: [
          {
            uploadedBy,
            type,
            message,
            images: uploadedImages,
          },
        ],
      });

      // 🔹 Set update id into project
      await ProjectModel.findByIdAndUpdate(projectId, {
        $set: { updates: newUpdate._id }
      });

      return res.status(201).json({
        success: true,
        message: "New update created successfully",
        data: newUpdate,
      });
    }
  } catch (error) {
    console.error("Error in addUpdate:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getAllUpdates = async (req, res) => {
  try {
    const allUpdates = await UpdateModel.find()
       .populate({
        path: "project",
        select: "title location category startingDate client",
        populate: {
          path: "client",
          select: "name email phone" 
        }
      })
      .populate("dailyUpdates.uploadedBy", "name email role");

    if (!allUpdates || allUpdates.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No updates found",
      });
    }

    res.status(200).json({
      success: true,
      totalProjects: allUpdates.length,
      updates: allUpdates,
    });
  } catch (error) {
    console.error("Error in getAllUpdates:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getUpdateById = async (req, res) => {
  try {
    const { id } = req.params;
    const update = await UpdateModel.findById(id)
     .populate({
        path: "project",
        select: "title location category startingDate client",
        populate: {
          path: "client",
          select: "name email phone" 
        }
      })
    .populate("dailyUpdates.uploadedBy", "name email role");

    if (!update) {
      return res.status(404).json({ success: false, message: "Update not found" });
    }

    res.status(200).json({ success: true, update });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching update", error: error.message });
  }
};

exports.deleteDailyUpdate = async (req, res) => {
  try {
    const { updateId, dailyUpdateId } = req.params;

    const updateDoc = await UpdateModel.findByIdAndUpdate(
      updateId,
      {
        $pull: {
          dailyUpdates: { _id: dailyUpdateId },
        },
      },
      { new: true }
    );

    if (!updateDoc) {
      return res.status(404).json({
        success: false,
        message: "Update document not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Daily update entry deleted successfully",
      data: updateDoc,
    });
  } catch (error) {
    console.error("Error deleting daily update entry:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
