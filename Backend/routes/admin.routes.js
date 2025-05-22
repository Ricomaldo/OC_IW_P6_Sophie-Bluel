const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middlewares/auth');

router.post('/reset', auth, adminController.resetDatabase);

module.exports = router; 