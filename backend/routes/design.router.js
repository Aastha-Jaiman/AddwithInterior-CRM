const express = require("express");
const router = express.Router();
const { uploadDesign, getDesignsByProjectId, getAllDesigns , addFeedbackToDesign, deletePdfs } = require("../controller/design.controller");
const upload = require("../middleware/multer");
const authMiddleware = require('../middleware/allAuthmiddleware')


router.post("/:projectId/upload", authMiddleware, upload.single("pdf"), uploadDesign);
router.get("/project/:projectId", getDesignsByProjectId);
router.get("/all",authMiddleware, getAllDesigns);
router.put("/feedback/:designId", addFeedbackToDesign);
router.delete("/:designId/pdf/:pdfId", authMiddleware, deletePdfs);



module.exports = router