const Task = require('../models/Task');

exports.getAllTasks = async (filter = {}, user) => {
  let queryFilter = { ...filter };

  // Employees can only see their own tasks
  if (user.role === 'employee') {
    queryFilter.assignedTo = user._id;
  }

  const tasks = await Task.find(queryFilter)
    .populate('assignedTo', 'name email department')
    .populate('assignedBy', 'name')
    .sort({ createdAt: -1 });

  return tasks;
};

exports.getTaskById = async (taskId) => {
  const task = await Task.findById(taskId)
    .populate('assignedTo', 'name email department')
    .populate('assignedBy', 'name');

  if (!task) {
    throw new Error('Task not found');
  }

  return task;
};

exports.createTask = async (taskData, assignedBy) => {
  const task = await Task.create({
    ...taskData,
    assignedBy
  });

  await task.populate('assignedTo', 'name email department');
  return task;
};

exports.updateTask = async (taskId, updates, user) => {
  const task = await Task.findById(taskId);
  
  if (!task) {
    throw new Error('Task not found');
  }

  // Employees can only update their own tasks
  if (user.role === 'employee' && 
      task.assignedTo.toString() !== user._id.toString()) {
    throw new Error('Access denied');
  }

  const allowedUpdates = ['status', 'progress', 'description'];
  const updatesKeys = Object.keys(updates);
  
  updatesKeys.forEach(update => {
    if (allowedUpdates.includes(update)) {
      task[update] = updates[update];
    }
  });

  await task.save();
  await task.populate('assignedTo', 'name email department');
  
  return task;
};

exports.deleteTask = async (taskId) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new Error('Task not found');
  }
  return task;
};

exports.getDashboardStats = async (user) => {
  let filter = {};
  if (user.role === 'employee') {
    filter.assignedTo = user._id;
  }

  const tasks = await Task.find(filter);
  
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    done: tasks.filter(t => t.status === 'Done').length,
    overallProgress: tasks.reduce((acc, task) => acc + task.progress, 0) / (tasks.length || 1)
  };

  return stats;
};