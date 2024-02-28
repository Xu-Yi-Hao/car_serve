var express = require('express');
var departments = express.Router();
const { getDepartments, getDepartmentByName, insertDep, updateDep, deleteDep } = require('../controllers/departmentController')

departments.get('/', (req, res) => {
    if (req.query.departmentName) {
        getDepartmentByName(req, res)
    } else {
        getDepartments(req, res)
    }
});

departments.get('/', getDepartments);


departments.post('/', insertDep);
departments.put('/:departmentID', updateDep);
departments.delete('/:departmentID', deleteDep);



module.exports = departments;
