const express = require("express");
const router = express.Router();
const { createService, getAllServices, getServiceById, updateService  } = require("../controller/service.controller");

router.post("/add/:projectId", createService);
router.get("/", getAllServices);
router.get("/:serviceId", getServiceById);
router.put("/update/:serviceId", updateService);

module.exports = router;
