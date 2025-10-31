const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const userController = require('../controller/userController');

const router = express.Router();

// Protect all routes - only admin can access
router.use(auth, authorize('admin'));

router.get('/employees', userController.getAllEmployees);
router.post('/employees', userController.createEmployee);
router.get('/employees/:id', userController.getEmployee);

module.exports = router;