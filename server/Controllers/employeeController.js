const Employee = require('../models/employeeModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const  getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ userId: req.userId });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

const addEmployee = async (req, res) => {
  const { name, position, contact } = req.body;

  if (!name || !position || !contact) {
    return res.status(400).json({ error: 'All fields (name, position, contact) are required' });
  }

  const existingEmployee = await Employee.findOne({ userId: req.userId, name });
  if (existingEmployee) {
    return res.status(400).json({ error: 'Employee with this name already exists' });
  }

  const contactRegex = /^\d{10}$/;
  if (!contactRegex.test(contact)) {
    return res.status(400).json({ error: 'Contact number must be numeric 10 Numbers Must' });
  }

  try {
    const employee = new Employee({ userId: req.userId, name, position, contact });
    await employee.save();
    res.status(201).json({ message: 'Employee added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add employee' });
  }
};

const updateEmployee = async (req, res) => {
  const { name, position, contact } = req.body;

  if (!name || !position || !contact) {
    return res.status(400).json({ error: 'All fields (name, position, contact) are required' });
  }

  const contactRegex = /^\d{10}$/;
  if (!contactRegex.test(contact)) {
    return res.status(400).json({ error: 'Contact number must be numeric 10 Numbers Must' });
  }

  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, { name, position, contact }, { new: true });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee', message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.send('Employee deleted successfully');
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};

module.exports = { updateEmployee, getEmployees, addEmployee, deleteEmployee };
