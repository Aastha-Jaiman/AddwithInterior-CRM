const express = require("express");
const router = express.Router();
const { createService, getAllServices, getServiceById, updateService  } = require("../controller/service.controller");
const authMiddleware = require("../middleware/allAuthmiddleware")

router.post("/add/:projectId",authMiddleware, createService);
router.get("/",authMiddleware, getAllServices);
router.get("/:serviceId",getServiceById);
router.put("/update/:serviceId",authMiddleware, updateService);

module.exports = router;
