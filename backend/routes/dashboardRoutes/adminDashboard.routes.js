const express = require('express');
const router = express.Router();

const { getAdminDashboard } = require('../../controller/dashboard/adminDashboard.controller');
const adminauthMiddleware = require('../../middleware/authmiddleware');

router.get('/', adminauthMiddleware, getAdminDashboard);

module.exports = router;
