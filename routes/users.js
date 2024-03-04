var express = require('express');
var user = express.Router();
const { getUsers, login, insertUser, getMenus, getUserByID,  selectRoleForUser, updateUser, updatePwd, deleteUser, getRoleOfUser } = require('../controllers/userController')

/* GET users listing. */
user.get('/', (req, res) => {
    if (req.query.userID) {
        getUserByID(req, res)
    } else {
        getUsers(req, res)
    }
});


user.get('/roles', getRoleOfUser)
user.get('/menu', getMenus)
user.post('/login', login);
user.put('/:userID', updateUser);
user.put('/pwd/:userID', updatePwd);
user.delete('/:userID', deleteUser)
user.post('/', insertUser)
user.post('/selectRole', selectRoleForUser)

module.exports = user;
