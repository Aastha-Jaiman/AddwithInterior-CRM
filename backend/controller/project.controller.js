const Project = require("../model/project.model");
const Client = require("../model/client.model");
const Admin = require("../model/admin.model");

// POST: Create project
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
      status = "Active",
      clientId,
      salespersonId,
      designerId,
      carpenterId,
    } = req.body;

    if (!title || !category || !clientId) {
      return res
        .status(400)
        .json({ message: "Title, category, and client are required." });
    }

    // Validate Client
    const client = await Client.findById(clientId).select("name email phone address");
    if (!client) return res.status(404).json({ message: "Client not found." });

    // Optional Staffs
    const salesperson = salespersonId
      ? await Admin.findById(salespersonId).select("name email phone")
      : null;
    if (salespersonId && !salesperson)
      return res.status(404).json({ message: "Salesperson not found." });

    const designer = designerId
      ? await Admin.findById(designerId).select("name email phone")
      : null;
    if (designerId && !designer)
      return res.status(404).json({ message: "Designer not found." });

    const carpenter = carpenterId
      ? await Admin.findById(carpenterId).select("name email phone")
      : null;
    if (carpenterId && !carpenter)
      return res.status(404).json({ message: "Carpenter not found." });

    const newProject = await Project.create({
      title,
      location,
      category,
      status,
      client: clientId,
      salesperson: salespersonId,
      designer: designerId,
      carpenter: carpenterId,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project: newProject,
      clientDetails: client,
      salespersonDetails: salesperson || null,
      designerDetails: designer || null,
      carpenterDetails: carpenter || null,
    });
  } catch (err) {
    console.error("Add Project Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// // GET: Search Clients, Salespersons, Designers, Carpenters
// exports.searchParticipants = async (req, res) => {
//   try {
//     const { type, search = "" } = req.query;

//     if (!type || !["client", "salesperson", "designer", "carpenter"].includes(type)) {
//       return res.status(400).json({ message: "Invalid or missing participant type." });
//     }

//     let result = [];

//     if (type === "client") {
//       result = await Client.find({
//         name: { $regex: search, $options: "i" },
//       }).select("name email phone");
//     } else {
//       // Search admins by role
//       const role = type;
//       result = await Admin.find({
//         role,
//         name: { $regex: search, $options: "i" },
//       }).select("name email phone");
//     }

//     res.status(200).json({ success: true, data: result });
//   } catch (err) {
//     console.error("Search Error:", err.message);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
