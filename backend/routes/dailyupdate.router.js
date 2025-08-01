const express = require("express");
const router = express.Router();
const { addUpdate } = require("../controllers/updateController");
const upload = require("../middleware/multer");
const auth = require("../middleware/auth");

router.post("/add", auth(["admin"]), upload.array("images", 5), addUpdate);

module.exports = router;
