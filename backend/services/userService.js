const User = require('../models/User');

exports.getAllEmployees = async () => {
  const employees = await User.find({ role: 'employee' })
    .select('name email department createdAt');
  return employees;
};

exports.createEmployee = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const employee = await User.create({
    ...userData,
    role: 'employee'
  });

  return {
    id: employee._id,
    name: employee.name,
    email: employee.email,
    department: employee.department,
    createdAt: employee.createdAt
  };
};

exports.getEmployeeById = async (employeeId) => {
  const employee = await User.findOne({ _id: employeeId, role: 'employee' })
    .select('name email department createdAt');
  
  if (!employee) {
    throw new Error('Employee not found');
  }

  return employee;
};