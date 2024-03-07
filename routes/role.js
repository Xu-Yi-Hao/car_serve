var express = require('express');
var role = express.Router();
const { getRoles,
    insertRole,
    updateRole,
    deleteRole, getAllRole } = require('../controllers/roleController')

/* GET roles listing. */

role.get('/', getRoles);
role.get('/all', getAllRole);
role.post('/', insertRole);
role.put('/:roleID', updateRole);
role.delete('/:roleID', deleteRole);

module.exports = role;
