const clientModel = require('../../model/client.model');
const projectModel = require('../../model/project.model');
const designModel = require('../../model/design.model');
const paymentHistoryModel = require('../../model/paymentHistory.model');
const quotationModel = require('../../model/quotation.model');
const dailyupdateModel = require('../../model/dailyupdate.model');
const brochureModel = require('../../model/brochure.model');
const adminModel = require('../../model/admin.model');

exports.getAdminDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Total payments calculation
    const payments = await paymentHistoryModel.find();
    const totalReceivedPayment = payments.reduce((sum, p) => sum + (p.receivedAmount || 0), 0);
    const totalPayment = payments.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

    // Total projects by status
    const pendingProjects = await projectModel.countDocuments({ status: "Pending" });
    const inProcessProjects = await projectModel.countDocuments({ status: "In-Process" });
    const completedProjects = await projectModel.countDocuments({ status: "Completed" });

    // Total projects by category
    const modularKitchenProjects = await projectModel.countDocuments({ category: "modular_Kitchen" });
    const inPlaceFurnitureProjects = await projectModel.countDocuments({ category: "inPlace_Furniture" });

    // Total staff by role (from Admin model)
    const totalSalespersons = await adminModel.countDocuments({ role: "salesperson" });
    const totalDesigners = await adminModel.countDocuments({ role: "designer" });
    const totalCarpenters = await adminModel.countDocuments({ role: "carpenter" });

    // Total brochures
    const totalBrochures = await brochureModel.countDocuments();
    const newBrochures = await brochureModel.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } }); // last 30 days

    const data = {
      totalClients: await clientModel.countDocuments(),
      totalProjects: await projectModel.countDocuments(),
      totalDesigns: await designModel.countDocuments(),
      totalPayments: payments.length,
      totalReceivedPayment,
      totalPayment,
      totalQuotations: await quotationModel.countDocuments(),
      totalStaff: {
        salesperson: totalSalespersons,
        designer: totalDesigners,
        carpenter: totalCarpenters
      },
      projectsByStatus: {
        Pending: pendingProjects,
        "In-Process": inProcessProjects,
        Completed: completedProjects
      },
      projectsByCategory: {
        modular_Kitchen: modularKitchenProjects,
        inPlace_Furniture: inPlaceFurnitureProjects
      },
      totalBrochures,
      newBrochures,
      recentProjects: await projectModel.find().sort({ createdAt: -1 }).limit(5),
      recentUpdates: await dailyupdateModel.find().sort({ createdAt: -1 }).limit(5)
    };

    res.status(200).json({ success: true, role: "admin", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
