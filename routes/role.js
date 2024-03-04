var express = require('express');
var role = express.Router();
const { getRoles,
    getRoleByID,
    insertRole,
    updateRole,
    deleteRole } = require('../controllers/roleController')

/* GET roles listing. */

role.get('/', (req, res) => {
    if (req.query.roleID) {
        getRoleByID(req, res)
    } else {
        getRoles(req, res)
    }
});

role.post('', insertRole);
role.put('/:roleID', updateRole);
role.delete('/:roleID', deleteRole);

module.exports = role;
