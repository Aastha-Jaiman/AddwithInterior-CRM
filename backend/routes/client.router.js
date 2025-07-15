const express = require('express');
const router = express.Router();
const { registerClientByAdmin, loginClient, getProfile, logoutClient, updateClientByAdmin, getAllClientByAdmin, resetPassword, resetEmailToken, changepassword } = require('../controller/client.controller');
const  upload  = require('../middleware/multer');
const adminauthMiddleware = require('../middleware/authmiddleware')
const authMiddleware = require('../middleware/allAuthmiddleware')
const clientauthMiddleware = require('../middleware/clientAuthmiddleware')


router.post('/add',adminauthMiddleware, authMiddleware, upload.single('image'), registerClientByAdmin)
router.post('/login', loginClient )
router.get('/profile',clientauthMiddleware , getProfile)
router.get('/logout', clientauthMiddleware, logoutClient)
router.get("/all", adminauthMiddleware, authMiddleware, getAllClientByAdmin);
router.put('/update/:id',adminauthMiddleware,authMiddleware,upload.single('profile'), updateClientByAdmin);
router.post('/forgot-password', resetEmailToken);
router.post('/password', changepassword)
router.put('/reset-password',clientauthMiddleware, resetPassword)

module.exports = router;