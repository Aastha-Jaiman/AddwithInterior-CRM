const express = require('express');
const router = express.Router();
const { registerClientByAdmin, loginClient, getProfile, logoutClient, updateClientByAdmin  } = require('../controller/client.controller');
const  upload  = require('../middleware/multer');
const adminauthMiddleware = require('../middleware/authmiddleware')
const authMiddleware = require('../middleware/allAuthmiddleware')
const clientauthMiddleware = require('../middleware/clientAuthmiddleware')

// router.post('/create', upload.single('profile'), createAdmin);
router.post('/add',adminauthMiddleware, authMiddleware, upload.single('image'), registerClientByAdmin)
router.post('/login', loginClient )
router.get('/profile',clientauthMiddleware , getProfile)
router.get('/logout', clientauthMiddleware, logoutClient)
// router.get("/staffs", adminauthMiddleware, authMiddleware, getAllStaff);
router.put('/update/:id',adminauthMiddleware,authMiddleware,upload.single('profile'), updateClientByAdmin)
// router.put('/user', authMiddleware,upload.single('profile'), updateAdminSelf)
// router.post('/forgot-password', resetEmailToken);
// router.post('/password', changePassword)
// router.put('/reset-password',authMiddleware, resetPassword)

module.exports = router;