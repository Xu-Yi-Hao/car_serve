var express = require('express');
var employees = express.Router();
const { getEmployees, getPositions, getEmployeeByID, insertEmployee, deleteEmployee, updateEmployee } = require('../controllers/employeeController')

employees.get('/', (req, res) => {
    if (req.query.employeeID) {
        getEmployeeByID(req, res)
    } else {
        getEmployees(req, res)
    }
});

employees.get('/position', getPositions);

employees.post('/', insertEmployee);
employees.put('/:employeeID', updateEmployee);
employees.delete('/:employeeID', deleteEmployee);



module.exports = employees;
