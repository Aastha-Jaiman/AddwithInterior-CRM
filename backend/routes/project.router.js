const express = require("express");
const router = express.Router();
const { addProject, searchAllForDropdown, getProjectById, getAllProject, updateProject, getMyProjects } = require("../controller/project.controller");
const authMiddleware = require("../middleware/allAuthmiddleware");
const clientauthMiddleware = require("../middleware/clientAuthmiddleware");
const upload = require("../middleware/multer")

router.post("/add", authMiddleware,upload.single("projectImage"), addProject);
router.get("/search-dropdown", searchAllForDropdown);
router.get("/all",authMiddleware, getAllProject)
router.put("/update/:id",authMiddleware, updateProject)
router.get("/my-projects", authMiddleware, getMyProjects);
router.get("/client/my-projects", clientauthMiddleware, getMyProjects);
router.get("/:id",authMiddleware, getProjectById);



module.exports = router;
