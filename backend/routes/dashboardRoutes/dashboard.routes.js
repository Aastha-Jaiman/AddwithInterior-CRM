const express = require("express");
const authMiddleware = require("../../middleware/allAuthmiddleware");
const { getDashboardData } = require("../../controller/dashboard/dashboard.controller");

const router = express.Router();


router.get("/", authMiddleware, getDashboardData);

module.exports = router;
