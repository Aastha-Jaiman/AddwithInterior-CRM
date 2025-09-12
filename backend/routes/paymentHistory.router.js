const express = require("express");
const router = express.Router();
const { addPayment, updatePayment, getAllPayments, getPaymentById } = require("../controller/paymentHistory.controller");
const upload = require("../middleware/multer")

router.post("/add", upload.single("file"), addPayment);
router.get("/all", getAllPayments );
router.get("/:paymentId", getPaymentById);
router.put("/update/:paymentId", upload.single("file"), updatePayment);


module.exports = router;
