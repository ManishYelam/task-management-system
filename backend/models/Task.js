const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Done'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  dueDate: {
    type: Date
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completedDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for overdue tasks
taskSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status === 'Done') return false;
  return this.dueDate < new Date();
});

// Indexes for better query performance
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });

// Document middleware
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-update progress based on status
  if (this.status === 'Done') {
    this.progress = 100;
    this.completedDate = new Date();
  } else if (this.status === 'In Progress' && this.progress < 50) {
    this.progress = 50;
  }
  
  next();
});

// Query middleware to populate references
taskSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'assignedTo',
    select: 'name email department'
  }).populate({
    path: 'assignedBy',
    select: 'name email'
  });

  this.find({ isActive: { $ne: false } });
  next();
});

// Static methods for statistics
taskSchema.statics.getTaskStatistics = async function(userId = null) {
  const matchStage = userId ? { assignedTo: mongoose.Types.ObjectId(userId) } : {};

  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgProgress: { $avg: '$progress' }
      }
    }
  ]);

  return stats;
};

taskSchema.statics.getOverdueTasks = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $ne: 'Done' }
  }).populate('assignedTo', 'name email');
};

module.exports = mongoose.model('Task', taskSchema);