const ServiceModel = require("../model/service.model");
const ProjectModel = require("../model/project.model");
const { uploadOnCloudinary} = require("../utils/cloudinary")
const fs = require("fs")

exports.createService = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { durationYears, allowedVisits } = req.body;

    if (!req.user || !["admin", "salesperson"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Only admin or salesperson can create a service."
      });
    }

    let missingFields = [];
    if (!durationYears) missingFields.push("durationYears");
    if (!allowedVisits) missingFields.push("allowedVisits");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      });
    }

    const project = await ProjectModel.findById(projectId).populate("client");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const newService = new ServiceModel({
      client: project.client,
      project: project._id,
      durationYears,
      allowedVisits,
    });
    await newService.save();

    project.service = newService._id;
    await project.save();

    return res.status(201).json({
      message: "Service history created successfully",
      data: newService,
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
    const { remarks, visitDate } = req.body;
    const file = req.file;

    if (!req.user || !["admin", "salesperson"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Only admin or salesperson can update service.",
      });
    }

    const service = await ServiceModel.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.isExpired || service.usedVisits >= service.allowedVisits) {
      return res
        .status(400)
        .json({ message: "Service has expired. No more visits can be added." });
    }

    let uploadedDoc;
    if (file) {
      try {
        uploadedDoc = await uploadOnCloudinary(file.path, {
          resource_type: "raw",
          folder: "service_bills",
        });
      } catch (err) {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res
          .status(500)
          .json({ message: "Error uploading document", error: err.message });
      }
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }

    service.visits.push({
      visitDate: visitDate ? new Date(visitDate) : new Date(),
      remarks: remarks || "",
      document: uploadedDoc?.secure_url || null,
    });

    service.usedVisits = service.visits.length;

    const expiryDate = new Date(service.startDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + service.durationYears);
    service.isExpired =
      service.usedVisits >= service.allowedVisits || new Date() >= expiryDate;

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