const express = require('express');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');
const taskController = require('../controller/taskController');

const router = express.Router();

// Protect all routes
router.use(auth);

router.get('/', taskController.getAllTasks);
router.post('/', authorize('admin'), taskController.createTask);
router.get('/dashboard/stats', taskController.getDashboardStats);

router.get('/:id', taskController.getTask);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', authorize('admin'), taskController.deleteTask);

module.exports = router;