const ProjectModel = require("../model/project.model");
const ClientModel = require("../model/client.model");
const Admin = require("../model/admin.model");
const {uploadOnCloudinary} = require("../utils/cloudinary")
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
      startingDate,
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

    // ✅ Handle multiple image uploads
    let projectImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path, "project");
        if (uploaded?.secure_url) {
          projectImages.push({
            url: uploaded.secure_url,
            public_id: uploaded.public_id,
          });
        }
        // Remove local temp file
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
      projectImages, // ✅ new field for multiple images
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project: newProject,
      clientDetails: client,
      salespersonDetails: salesperson || null,
      designerDetails: designer || null,
    });

  } catch (err) {
    console.error("Add Project Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// carpenter, salespersons, designers, clients search 
exports.searchAllForDropdown = async (req, res) => {
      try {
            const keyword = req.query.keyword || "";

            const [clients, salespersons, designers, carpenters] = await Promise.all([
                  Client.find({
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

            const project = await ProjectModel.findById(id);

            if (!project) {
                  res.status(400).json({ message: "Project Not Found." });
            }

            res.status(200).json({
                  success: true,
                  message: "Fetch Porject Successfully.",
                  project
            })

      } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
      }
}

exports.getAllProject = async (req, res) => {
      try {
            const user = req.user;

            if (!user || user.role !== "admin") {
                  return res.status(403).json({ message: "Only admin can get all projects." });
            }

            const projects = await ProjectModel.find();

            if(!projects){
                  return res.status(400).json({ message: "Project Not Found." });
            };

            res.status(200).json({
                  success: true,
                  message: "Fetch All Projects Successfully.",
                  projects
            })

      }catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
      }
}

exports.updateProject = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update projects." });
    }

    const { id } = req.params;

    const {
      title,
      location,
      category,
      status,
      clientId,
      salespersonId,
      designerId,
      carpenterId,
    } = req.body;

    const project = await ProjectModel.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (clientId) {
      const client = await ClientModel.findById(clientId).select("name email phone address");
      if (!client) return res.status(404).json({ message: "Client not found." });
    }

    if (salespersonId) {
      const salesperson = await Admin.findById(salespersonId).select("name email phone");
      if (!salesperson)
        return res.status(404).json({ message: "Salesperson not found." });
    }

    if (designerId) {
      const designer = await Admin.findById(designerId).select("name email phone");
      if (!designer)
        return res.status(404).json({ message: "Designer not found." });
    }

    if (carpenterId) {
      const carpenter = await Admin.findById(carpenterId).select("name email phone");
      if (!carpenter)
        return res.status(404).json({ message: "Carpenter not found." });
    }

    if (title) project.title = title;
    if (location) project.location = location;
    if (category) project.category = category;
    if (status) project.status = status;
    if (clientId) project.client = clientId;
    if (salespersonId) project.salesperson = salespersonId;
    if (designerId) project.designer = designerId;
    if (carpenterId) project.carpenter = carpenterId;

    const updatedProject = await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      project: updatedProject,
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
      .populate("client", "name email")
      .populate("salesperson", "name email")
      .populate("designer", "name email")
      .populate("carpenter", "name email");

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};