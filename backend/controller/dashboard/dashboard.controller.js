// const clientModel = require("../../model/client.model");
const projectModel = require("../../model/project.model");
const quotationModel = require("../../model/quotation.model");
const dailyupdateModel = require("../../model/dailyupdate.model");
const brochureModel = require("../../model/brochure.model");

exports.getDashboardData = async (req, res) => {
  try {
    const user = req.user;
    const role = user.role;
    const permissions = user.permission || [];

    // 1. Identify user's assigned projects
    let projectQuery = {};
    if (role === "salesperson") projectQuery.salesperson = user._id;
    if (role === "designer") projectQuery.designer = user._id;
    if (role === "carpenter") projectQuery.carpenter = user._id;

    const assignedProjects = await projectModel
      .find(projectQuery)
      .populate("client", "name email phone")
      .select("title status category location client createdAt");

    const projectIds = assignedProjects.map((p) => p._id);

    // 2. Count totals (same structure as admin)

    // total projects assigned to this user
    const totalProjects = assignedProjects.length;

    // unique clients from those projects
    const uniqueClientIds = [
      ...new Set(assignedProjects.map((p) => p.client?._id?.toString())),
    ].filter(Boolean);
    const totalClients = uniqueClientIds.length;

    // total brochures (common for everyone)
    const totalBrochures = await brochureModel.countDocuments();

    // projects by category
    const projectsByCategory = {};
    assignedProjects.forEach((p) => {
      const category = p.category || "Uncategorized";
      projectsByCategory[category] = (projectsByCategory[category] || 0) + 1;
    });

    // projects by status
    const projectsByStatus = {};
    assignedProjects.forEach((p) => {
      const status = p.status || "Unknown";
      projectsByStatus[status] = (projectsByStatus[status] || 0) + 1;
    });

    // 3. Role-specific sections
    // let extraData = {};

    // if (role === "salesperson") {
    //   if (permissions.includes("view_quotations")) {
    //     const quotations = await quotationModel
    //       .find({ project: { $in: projectIds } })
    //       .populate("project", "title")
    //       .populate("client", "name email");
    //     extraData.quotations = quotations;
    //   }
    //   if (permissions.includes("upload_quotation")) {
    //     extraData.uploadQuotationAccess = true;
    //   }
    // }

    // if (role === "designer") {
    //   if (permissions.includes("view_design_feedback")) {
    //     const feedbackProjects = await projectModel
    //       .find({ designer: user._id, designsUploaded: true })
    //       .populate("client", "name email")
    //       .select("title category status designsUploaded");
    //     // extraData.designFeedbackProjects = feedbackProjects;
    //   }
    //   // if (permissions.includes("upload_design")) {
    //   //   extraData.uploadDesignAccess = true;
    //   // }
    // }

    // if (role === "carpenter") {
    //   if (permissions.includes("view_daily_updates")) {
    //     const updates = await dailyupdateModel
    //       .find({ project: { $in: projectIds } })
    //       .populate("project", "title category")
    //       .populate("dailyUpdates.uploadedBy", "name role");
    //     extraData.dailyUpdates = updates;
    //   }
    //   if (permissions.includes("upload_daily_updates")) {
    //     extraData.uploadUpdateAccess = true;
    //   }
    // }

    // 4. Final formatted data (like admin)
    const data = {
      totalProjects,
      totalClients,
      totalBrochures,
      projectsByCategory,
      projectsByStatus,
      recentProjects: assignedProjects.slice(-5).reverse(),
      // ...extraData,
    };

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      role,
      permissions,
      data,
    });
  } catch (error) {
    console.error("Role Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
