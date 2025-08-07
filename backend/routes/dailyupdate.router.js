const express = require("express");
const router = express.Router();
const { addUpdate, getAllUpdates, getUpdateById, deleteDailyUpdate } = require("../controller/dailyupdate.controller");
const upload = require("../middleware/multer");
const authMiddleware = require("../middleware/allAuthmiddleware");

router.post("/upload/:projectId", authMiddleware, upload.array("images"), addUpdate);
router.get("/all", authMiddleware, getAllUpdates);
router.get("/:id", getUpdateById);
router.delete("/:updateId/daily/:dailyUpdateId", authMiddleware, deleteDailyUpdate);


module.exports = router;
