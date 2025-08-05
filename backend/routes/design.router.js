const express = require("express");
const router = express.Router();
const { uploadDesign } = require("../controller/design.controller");
const upload = require("../middleware/multer");
const authMiddleware = require('../middleware/allAuthmiddleware')


router.post("/upload", authMiddleware, upload.single)

module.exports = router