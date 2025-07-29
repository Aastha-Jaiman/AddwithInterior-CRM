const express = require("express");
const router = express.Router();
const { addProject } = require("../controller/project.controller");
const authMiddleware = require("../middleware/allAuthmiddleware");

router.post("/add", authMiddleware, addProject);
// router.get("/search-participant", protect, searchParticipants);

module.exports = router;
