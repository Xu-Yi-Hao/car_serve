var express = require('express');
var role = express.Router();
const { getRoles,
    insertRole,
    updateRole,
    deleteRole } = require('../controllers/roleController')

/* GET roles listing. */

role.get('/', getRoles);
role.post('/', insertRole);
role.put('/:roleID', updateRole);
role.delete('/:roleID', deleteRole);

module.exports = role;
