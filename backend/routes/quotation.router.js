const express = require("express");
const router = express.Router();
const { addQuotation, getAllClientsEmail, getProjectsByClientEmail, getAllQuotations, getQuotationById, uploadFinalDocument, getFinalDocument, updateQuotation, getDefaultSections  } = require("../controller/quotation.controller");
const authMiddleware = require("../middleware/allAuthmiddleware");
const upload = require("../middleware/multer")

router.post("/add", authMiddleware, addQuotation);
router.put("/update/:quotationId", authMiddleware, updateQuotation);
router.get("/clients", getAllClientsEmail);
router.get("/projects/:email", getProjectsByClientEmail);
router.get("/", authMiddleware, getAllQuotations);
router.get("/:id", getQuotationById);
router.post("/upload/:quotationId", upload.single("pdf"), uploadFinalDocument);
router.get("/:quotationId/finaldocument", getFinalDocument);
router.get("/default/:projectId", authMiddleware, getDefaultSections);

module.exports = router;
