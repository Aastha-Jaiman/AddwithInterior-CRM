const express = require('express');
const router = express.Router();
const { addContact, getAllContact, getbyId } = require('../controller/contact.controller');
const authMiddleware = require('../middleware/allAuthmiddleware')


router.post('/add', addContact);
router.get('/all', authMiddleware, getAllContact)
router.get("/:id",authMiddleware, getbyId);

module.exports = router;