const express = require('express');
const { getEmployees, addEmployee, deleteEmployee, updateEmployee } = require('../Controllers/employeeController');


const router = express.Router();


router.get('/', getEmployees);


router.post('/', addEmployee);

router.delete('/:id', deleteEmployee);

router.put('/:id', updateEmployee);

module.exports = router;