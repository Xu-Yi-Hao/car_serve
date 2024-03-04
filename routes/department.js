var express = require('express');
var departments = express.Router();
const { getDepartments, insertDep, updateDep, deleteDep } = require('../controllers/departmentController')

departments.get('/', getDepartments);

departments.post('/', insertDep);
departments.put('/:departmentID', updateDep);
departments.delete('/:departmentID', deleteDep);



module.exports = departments;
