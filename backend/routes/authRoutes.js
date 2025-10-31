const express = require('express');
// const  = require('../controllers/authController');
const auth = require('../middleware/auth');
const authController = require('../controller/authController');

const router = express.Router();

router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);

module.exports = router;