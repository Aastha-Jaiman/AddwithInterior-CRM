const express = require('express');
const router = express.Router();
const { createAdmin, registerStaffByAdmin, login, profiledData, updateStaffByAdmin, logout, updateAdminSelf, resetEmailToken, changePassword, resetPassword, getAllStaff, getStaffById } = require('../controller/admin.controller');
const  upload  = require('../middleware/multer');
const adminauthMiddleware = require('../middleware/authmiddleware')
const authMiddleware = require('../middleware/allAuthmiddleware')


router.post('/create', upload.single('profile'), createAdmin);
router.post('/add',adminauthMiddleware, upload.single('profile'), registerStaffByAdmin)
router.post('/login', login)
router.get('/profile', authMiddleware, profiledData)
router.get('/logout', authMiddleware, logout)
router.get("/staffs", adminauthMiddleware, authMiddleware, getAllStaff);
router.put('/update/:id',adminauthMiddleware,upload.single('profile'), updateStaffByAdmin)
router.put('/user', authMiddleware,upload.single('profile'), updateAdminSelf)
router.post('/forgot-password', resetEmailToken);
router.post('/password', changePassword)
router.put('/reset-password',authMiddleware, resetPassword)

router.get("/:id", adminauthMiddleware,authMiddleware, getStaffById);

module.exports = router;