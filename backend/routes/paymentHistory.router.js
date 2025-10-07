const express = require("express");
const router = express.Router();
const { addPayment, updatePayment, getAllPayments, getPaymentById, deletePayment, getMyProjectPaymentHistory } = require("../controller/paymentHistory.controller");
const upload = require("../middleware/multer");
const clientauthMiddleware = require("../middleware/clientAuthmiddleware");

router.post("/add", upload.single("file"), addPayment);
router.get("/all", getAllPayments );
router.get("/:paymentId", getPaymentById);
router.put("/update/:paymentId", upload.single("file"), updatePayment);
router.delete("/delete/:paymentId", deletePayment);

router.get("/my/history", clientauthMiddleware, getMyProjectPaymentHistory);

module.exports = router;
