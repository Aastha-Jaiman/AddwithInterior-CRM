const express = require("express");
const router = express.Router();
const { addBrochure, getAllBrochure, getBrochureByid, deleteBrochureByid, updateBrochure } = require("../controller/brochur.controller");
const  upload  = require('../middleware/multer');
const authMiddleware = require('../middleware/allAuthmiddleware')

router.post("/add", upload.single("document"), authMiddleware , addBrochure);
router.get("/all",getAllBrochure);
router.get("/:id",getBrochureByid);
router.delete("/delete/:id", deleteBrochureByid);
router.put("/update/:id",upload.single("document"), updateBrochure)

module.exports = router;
