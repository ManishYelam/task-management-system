const userService = require('../services/userService');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await userService.getAllEmployees();

    res.status(200).json({
      status: 'success',
      results: employees.length,
      data: {
        employees
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const employee = await userService.createEmployee(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        employee
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const employee = await userService.getEmployeeById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        employee
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
};