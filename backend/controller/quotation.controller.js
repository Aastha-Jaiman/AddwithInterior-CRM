const QuotationModel = require("../model/quotation.model");
const ClientModel = require("../model/client.model");
const ProjectModel = require("../model/project.model");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const fs = require("fs")
const defaultSections = require("../utils/quotationTemplates");

exports.addQuotation = async (req, res) => {
  try {
    const { client, project, sections } = req.body;
    const userRole = req.user.role;

    const clientData = await ClientModel.findById(client);
    if (!clientData) {
      return res.status(404).json({ message: "Client not found" });
    }

    const projectData = await ProjectModel.findById(project);
    if (!projectData) {
      return res.status(404).json({ message: "Project not found" });
    }

    const allowedSections = ["Wooden Part", "Hardware", "Accessories", "Labour", "Other"];

    const combinedSections = [...defaultSections, ...(sections || [])];

    const preparedSections = combinedSections.map((section) => {
      let sectionTotal = 0;
      let sectionName = section.sectionName;
      let customSectionName = section.customSectionName || "";

      if (!allowedSections.includes(sectionName)) {
        customSectionName = sectionName;
        sectionName = "Other";
      }

      const preparedItems = section.items.map((item) => {
        const height = Number(item.height ?? 1);
        const width = Number(item.width ?? 1);
        const area = width * height;
        const calculation = `${width} * ${height}`;
        let total = 0;

        if (userRole === "admin") {
          const rate = Number(item.price || 0);
          total = rate * area;
        }

        sectionTotal += total;

        return {
          itemName: item.itemName,
          price: item.price,
          height,
          width,
          calculation,
          total,
        };
      });

      return {
        sectionName,
        customSectionName,
        items: preparedItems,
        sectionTotal,
      };
    });

    const grandTotal = preparedSections.reduce((acc, sec) => acc + sec.sectionTotal, 0);

    const newQuotation = new QuotationModel({
      project,
      client,
      category: projectData.category,
      type: "rough",
      sections: preparedSections,
      grandTotal,
      isApproved: false,
    });

    await newQuotation.save();

    await ProjectModel.findByIdAndUpdate(project, { quotation: newQuotation._id }, { new: true });

    res.status(201).json({
      message: "Quotation created successfully",
      quotation: newQuotation,
    });
  } catch (error) {
    console.error("Error adding quotation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateQuotation = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const { sections, isApproved } = req.body;
    const userRole = req.user.role;

    const quotation = await QuotationModel.findById(quotationId);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    sections.forEach((sectionUpdate) => {
      const existingSection = quotation.sections.find(
        (sec) => sec.sectionName === sectionUpdate.sectionName
      );

      if (existingSection) {
        sectionUpdate.items.forEach((itemUpdate) => {
          const existingItem = existingSection.items.find(
            (it) => it.itemName === itemUpdate.itemName
          );

          if (existingItem) {
            const height = Number(itemUpdate.height || 0);
            const width = Number(itemUpdate.width || 0);
            const area = width * height;

            existingItem.height = height;
            existingItem.width = width;
            existingItem.calculation = `${width} * ${height}`;

            if (userRole === "admin") {
              existingItem.total = Number(existingItem.price || 0) * area;
            }
          }
        });

        existingSection.sectionTotal = existingSection.items.reduce(
          (acc, it) => acc + (it.total || 0),
          0
        );
      }
    });

    quotation.grandTotal = quotation.sections.reduce(
      (acc, sec) => acc + (sec.sectionTotal || 0),
      0
    );

    if (typeof isApproved === "boolean") {
      quotation.isApproved = isApproved;
    }

    await quotation.save();

    res.status(200).json({
      message: "Quotation updated successfully",
      quotation,
    });
  } catch (error) {
    console.error("Error updating quotation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllClientsEmail = async (req, res) => {
  try {
    const clients = await ClientModel.find({});
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getProjectsByClientEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const client = await ClientModel.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const projects = await ProjectModel.find({ client: client._id });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllQuotations = async (req, res) => {
  try {
    const quotations = await QuotationModel.find()
      .populate("client", "name email") 
      .populate("project", "title category");

    res.status(200).json({
      success: true,
      count: quotations.length,
      data: quotations,
    });
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quotations",
      error: error.message,
    });
  }
};
 
exports.getQuotationById = async (req, res) => {
  try {
    const { id } = req.params; 

    const quotation = await QuotationModel.findById(id)
      .populate("client", "name email")
      .populate("project", "title category");

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    console.error("Error fetching quotation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quotation",
      error: error.message,
    });
  }
};

exports.uploadFinalDocument = async (req, res) => {
  try {
    const { quotationId } = req.params;
    const file = req.file;

    if (!quotationId || !file) {
      return res.status(400).json({
        success: false,
        message: "Quotation ID and PDF file are required.",
      });
    }

    const quotation = await QuotationModel.findById(quotationId);
    if (!quotation) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    let uploadedPdf;
    try {
      uploadedPdf = await uploadOnCloudinary(file.path, {
        resource_type: "raw",
        folder: "quotations",
      });

      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (uploadErr) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return res.status(500).json({
        success: false,
        message: "Failed to upload PDF to Cloudinary",
        error: uploadErr.message,
      });
    }

    quotation.finaldocument = uploadedPdf.secure_url;
    await quotation.save();

    res.status(200).json({
      success: true,
      message: "Final document uploaded successfully",
      quotation,
    });
  } catch (error) {
    console.error("Error uploading final document:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getFinalDocument = async (req, res) => {
  try {
    const { quotationId } = req.params;

    if (!quotationId) {
      return res.status(400).json({
        success: false,
        message: "Quotation ID is required",
      });
    }

    const quotation = await QuotationModel.findById(quotationId).select("finaldocument");

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    if (!quotation.finaldocument) {
      return res.status(404).json({
        success: false,
        message: "No final document uploaded for this quotation",
      });
    }

    res.status(200).json({
      success: true,
      message: "Final document fetched successfully",
      finaldocument: quotation.finaldocument,
    });
  } catch (error) {
    console.error("Error fetching final document:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
