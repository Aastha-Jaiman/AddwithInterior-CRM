const express = require("express");
const router = express.Router();
const { createService, getAllServices, getServiceById, updateService  } = require("../controller/service.controller");
const authMiddleware = require("../middleware/allAuthmiddleware");
const upload = require("../middleware/multer");

router.post("/add/:projectId",authMiddleware, upload.single("bill"), createService);
router.get("/",authMiddleware, getAllServices);
router.get("/:serviceId",getServiceById);
router.put("/update/:serviceId",authMiddleware, updateService);

module.exports = router;
