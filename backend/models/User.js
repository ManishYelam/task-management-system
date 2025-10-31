const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'employee'],
    default: 'employee'
  },
  department: {
    type: String,
    required: true
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

// Virtual populate tasks
userSchema.virtual('assignedTasks', {
  ref: 'Task',
  foreignField: 'assignedTo',
  localField: '_id'
});

userSchema.virtual('createdTasks', {
  ref: 'Task',
  foreignField: 'assignedBy',
  localField: '_id'
});

// Document middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Query middleware - only show active users
userSchema.pre(/^find/, function(next) {
  this.find({ isActive: { $ne: false } });
  next();
});

// Instance methods
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);