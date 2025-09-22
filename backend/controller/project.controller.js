const ProjectModel = require("../model/project.model");
const DesignModel = require("../model/design.model");
const ClientModel = require("../model/client.model");
const UpdateModel = require("../model/dailyupdate.model")
const Admin = require("../model/admin.model")
const { uploadOnCloudinary } = require("../utils/cloudinary")
const fs = require("fs")

// create project
exports.addProject = async (req, res) => {
  try {
    const user = req.user;

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add projects." });
    }

    const {
      title,
      location,
      category,
      status,
      clientId,
      salespersonId,
      designerId,
      carpenterId,
      estimatedBudget,
      description,
      startingDate
    } = req.body;

    if (!title || !category || !clientId) {
      return res.status(400).json({ message: "Title, category, and client are required." });
    }

    const client = await ClientModel.findById(clientId).select("name email phone address");
    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }

    const salesperson = salespersonId
      ? await Admin.findById(salespersonId).select("name email phone")
      : null;
    if (salespersonId && !salesperson) {
      return res.status(404).json({ message: "Salesperson not found." });
    }

    const designer = designerId
      ? await Admin.findById(designerId).select("name email phone")
      : null;
    if (designerId && !designer) {
      return res.status(404).json({ message: "Designer not found." });
    }

    let carpenter = null;
    if (carpenterId) {
      const foundCarpenter = await Admin.findById(carpenterId).select("name email phone");
      if (!foundCarpenter) {
        return res.status(404).json({ message: "Carpenter not found." });
      }
      carpenter = carpenterId;
    }

    let projectImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path, "project");
        if (uploaded?.secure_url) {
          projectImages.push({
            url: uploaded.secure_url,
            public_id: uploaded.public_id
          });
        }
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    const newProject = await ProjectModel.create({
      title,
      location,
      category,
      status,
      client: clientId,
      salesperson: salespersonId,
      designer: designerId,
      carpenter,
      estimatedBudget,
      description,
      startingDate,
      projectImages
    });

    await ClientModel.findByIdAndUpdate(
      clientId,
      { $push: { project: newProject._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project: newProject,
      clientDetails: client,
      salespersonDetails: salesperson || null,
      designerDetails: designer || null
    });
  } catch (err) {
    console.error("Add Project Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// carpenter, salespersons, bdesigners, clients search 
exports.searchAllForDropdown = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const [clients, salespersons, designers, carpenters] = await Promise.all([
      ClientModel.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      }).select("name email _id"),

      Admin.find({
        role: "salesperson",
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      }).select("name email _id"),

      Admin.find({
        role: "designer",
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      }).select("name email _id"),

      Admin.find({
        role: "carpenter",
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      }).select("name email _id"),
    ]);

    res.status(200).json({ clients, salespersons, designers, carpenters });
  } catch (err) {
    console.error("Search Dropdown Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await ProjectModel.findById(id)
      .populate("client", "name email phone address")
      .populate("salesperson", "name email phone")
      .populate("designer", "name email phone")
      .populate("carpenter", "name email phone")
      .populate({
        path: "quotation",
        populate: { path: "client project" }
      })
      .populate({
        path: "service",
        populate: { path: "client project" }
      });

    if (!project) {
      return res.status(400).json({ message: "Project Not Found." });
    }

    const designs = await DesignModel.find({ project: id }).populate(
      "pdfs.uploadedBy",
      "name email phone"
    );

    const dailyUpdates = await UpdateModel.find({ project: id }).populate(
      "dailyUpdates.uploadedBy",
      "name email phone role"
    );

    res.status(200).json({
      success: true,
      message: "Fetch Project Successfully.",
      project: {
        ...project._doc,
        designs,
        dailyUpdates,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllProject = async (req, res) => {
  try {
    const user = req.user;

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can get all projects." });
    }

    const projects = await ProjectModel.find()
      .populate("client", "name email phone address")
      .populate("salesperson", "name email phone")
      .populate("designer", "name email phone")
      .populate("carpenter", "name email phone")
      .populate({
        path: "quotation",
        populate: { path: "client project" }
      })
      .populate({
        path: "designs",
        populate: { path: "pdfs.uploadedBy", select: "name email phone" }
      })
      .populate({
        path: "updates",
        populate: { path: "dailyUpdates.uploadedBy", select: "name email phone role" }
      })
      .populate({
        path: "service",
        populate: { path: "client project" }
      });


    if (!projects || projects.length === 0) {
      return res.status(400).json({ message: "Projects Not Found." });
    }

    res.status(200).json({
      success: true,
      message: "Fetched all projects with design details.",
      projects
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update projects." });
    }

    const {
      title,
      finalBudget,
      description,
      status,
      salespersonId,
      designerId,
      carpenterId,
    } = req.body;

    const project = await ProjectModel.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    let salesperson = null;
    let designer = null;
    let carpenter = null;

    if (salespersonId) {
      salesperson = await Admin.findById(salespersonId).select("name email phone");
      if (!salesperson) {
        return res.status(404).json({ message: "Salesperson not found." });
      }
      project.salesperson = salespersonId;
    }

    if (designerId) {
      designer = await Admin.findById(designerId).select("name email phone");
      if (!designer) {
        return res.status(404).json({ message: "Designer not found." });
      }
      project.designer = designerId;
    }

    if (carpenterId) {
      carpenter = await Admin.findById(carpenterId).select("name email phone");
      if (!carpenter) {
        return res.status(404).json({ message: "Carpenter not found." });
      }
      project.carpenter = carpenterId;
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path, "project");
        if (uploaded?.secure_url) {
          project.projectImages.push({
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
          });
        }
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    if (title) project.title = title;
    if (finalBudget) project.finalBudget = finalBudget;
    if (description) project.description = description;
    if (status) project.status = status;

    const updatedProject = await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      project: updatedProject,
      salespersonDetails: salesperson || null,
      designerDetails: designer || null,
      carpenterDetails: carpenter || null,
    });

  } catch (err) {
    console.error("Update Project Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    const { _id, role } = req.user;
    let filter = {};

    if (role === "admin") {
      filter = {};
    } else if (role === "designer") {
      filter.designer = _id;
    } else if (role === "salesperson") {
      filter.salesperson = _id;
    } else if (role === "carpenter") {
      filter.carpenter = _id;
    } else if (role === "client") {
      filter.client = _id;
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const projects = await ProjectModel.find(filter)
      .populate("client", "name email phone address")
      .populate("salesperson", "name email phone")
      .populate("designer", "name email phone")
      .populate("carpenter", "name email phone")
      .populate({
        path: "quotation",
        populate: { path: "client project" }
      })
      .populate({
        path: "service",
        populate: { path: "client project" }
      });

    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        const [designs, dailyUpdates] = await Promise.all([
          DesignModel.find({ project: project._id }).populate(
            "pdfs.uploadedBy",
            "name email phone"
          ),
          UpdateModel.find({ project: project._id }).populate(
            "dailyUpdates.uploadedBy",
            "name email phone"
          ),
        ]);

        return {
          ...project._doc,
          designs,
          dailyUpdates,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: projectsWithDetails.length,
      projects: projectsWithDetails,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMyProjectClientEmail = async (req, res) => {
  try {
    const { _id, role } = req.user;
    let filter = {};

    if (role === "admin") {
      filter = {};
    } else if (role === "designer") {
      filter.designer = _id;
    } else if (role === "salesperson") {
      filter.salesperson = _id;
    } else if (role === "carpenter") {
      filter.carpenter = _id;
    } else if (role === "client") {
      filter.client = _id;
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const projects = await ProjectModel.find(filter)
      .populate("client", "email name phone") 
      .select("title client");

    const clientEmails = projects.map((project) => ({
      projectId: project._id,
      projectTitle: project.title,
      clientEmail: project.client?.email || "No email",
      clientName: project.client?.name || "No name",
      clientPhone: project.client?.phone || "No phone",
    }));

    res.status(200).json({
      success: true,
      count: clientEmails.length,
      clients: clientEmails,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
