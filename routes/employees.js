var express = require('express');
var employees = express.Router();
const { getEmployees, getPositions, getEmployeeByID, getEmployeeByName, insertEmployee, deleteEmployee, updateEmployee } = require('../controllers/employeeController')

employees.get('/', (req, res) => {
    if (req.query.employeeID) {
        getEmployeeByID(req, res)
    } else if (req.query.employeeName) {
        getEmployeeByName(req, res)
    } else {
        getEmployees(req, res)
    }
});

employees.get('/position', getPositions);

employees.post('/', insertEmployee);
employees.put('/:employeeID', updateEmployee);
employees.delete('/:employeeID', deleteEmployee);



module.exports = employees;
