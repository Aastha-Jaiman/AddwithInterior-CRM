const express = require("express");
const router = express.Router();
const { addProject, searchAllForDropdown, getProjectById, getAllProject, updateProject, getMyProjects, getMyProjectClientEmail,getProjectsByClientEmail } = require("../controller/project.controller");
const authMiddleware = require("../middleware/allAuthmiddleware");
const clientauthMiddleware = require("../middleware/clientAuthmiddleware");
const upload = require("../middleware/multer")

router.post("/add", authMiddleware,upload.array("projectImage"), addProject);
router.get("/search-dropdown", searchAllForDropdown);
router.get("/all",authMiddleware, getAllProject)
router.put("/update/:id",authMiddleware,upload.array("projectImage"), updateProject)
router.get("/my-projects", authMiddleware, getMyProjects);
router.get("/client/my-projects", clientauthMiddleware, getMyProjects);
router.get("/my-project-clients", authMiddleware, getMyProjectClientEmail);
router.get("/:id", getProjectById);



    
module.exports = router;
