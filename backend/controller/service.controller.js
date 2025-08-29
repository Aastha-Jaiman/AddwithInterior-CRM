const ServiceModel = require("../model/service.model");
const ProjectModel = require("../model/project.model");

exports.createService = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { durationYears, allowedVisits } = req.body;

    let missingFields = [];
    if (!durationYears) missingFields.push("durationYears");
    if (!allowedVisits) missingFields.push("allowedVisits");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields: missingFields,
      });
    }

    const project = await ProjectModel.findById(projectId).populate("client");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const newHistory = new ServiceModel({
      client: project.client,
      project: project._id,
      durationYears,
      allowedVisits,
    });

    await newHistory.save();

    return res.status(201).json({
      message: "Service history created successfully",
      data: newHistory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating service history",
      error: error.message,
    });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await ServiceModel.find()
      .populate("client", "name email phone" )   
      .populate("project"); 
    return res.status(200).json({
      message: "All services fetched successfully",
      data: services,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching services",
      error: error.message,
    });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await ServiceModel.findById(serviceId)
      .populate("client" , "name email phone")
      .populate("project");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({
      message: "Service fetched successfully",
      data: service,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching service",
      error: error.message,
    });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { remarks } = req.body;

    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.isExpired || service.usedVisits >= service.allowedVisits) {
      return res.status(400).json({
        message: "Service has expired. No more visits can be added.",
      });
    }

    if (remarks) {
      service.visits.push({
        visitDate: new Date(),
        remarks: remarks,
      });
    }

    service.usedVisits = service.visits.length;

    const expiryDate = new Date(service.startDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + service.durationYears);

    if (
      service.usedVisits >= service.allowedVisits ||
      new Date() >= expiryDate
    ) {
      service.isExpired = true;
    } else {
      service.isExpired = false;
    }

    await service.save();

    return res.status(200).json({
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating service",
      error: error.message,
    });
  }
};
