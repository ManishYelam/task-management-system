const taskService = require('../services/taskService');

exports.getAllTasks = async (req, res) => {
  try {
    const { status, assignedTo } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (assignedTo && req.user.role === 'admin') filter.assignedTo = assignedTo;

    const tasks = await taskService.getAllTasks(filter, req.user);

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: {
        tasks
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        task
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body, req.user.id);

    res.status(201).json({
      status: 'success',
      data: {
        task
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user);

    res.status(200).json({
      status: 'success',
      data: {
        task
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await taskService.getDashboardStats(req.user);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};