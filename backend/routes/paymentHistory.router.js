const express = require("express");
const router = express.Router();
const { addPayment, updatePayment, getAllPayments, getPaymentById } = require("../controller/paymentHistory.controller");

router.post("/add", addPayment);
router.get("/all", getAllPayments );
router.get("/:paymentId", getPaymentById);
router.put("/update/:paymentId", updatePayment);


module.exports = router;
