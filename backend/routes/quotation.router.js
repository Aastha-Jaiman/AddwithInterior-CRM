const express = require("express");
const router = express.Router();
const { addQuotation, getAllClientsEmail, getProjectsByClientEmail, getAllQuotations, getQuotationById, uploadFinalDocument, getFinalDocument  } = require("../controller/quotation.controller");
const authMiddleware = require("../middleware/allAuthmiddleware");
const upload = require("../middleware/multer")

router.post("/add", authMiddleware, addQuotation);
router.get("/clients", getAllClientsEmail);
router.get("/projects/:email", getProjectsByClientEmail);
router.get("/", authMiddleware, getAllQuotations);
router.get("/:id", getQuotationById);
router.post("/upload/:quotationId", upload.single("pdf"), uploadFinalDocument);
router.get("/:quotationId/finaldocument", getFinalDocument);

module.exports = router;
