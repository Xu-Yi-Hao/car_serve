var express = require('express');
var user = express.Router();
const { getUsers, login, allUsername, insertUser, getMenus } = require('../controllers/userController')

/* GET users listing. */
user.get('/', (req, res) => {
    if (req.query.userID) {
        getMenus(req, res)
    } else {
        getUsers(req, res)
    }
})
// user.get('/', getUsers);
user.get('/username', allUsername);
user.post('/login', login);
user.post('/', insertUser)
// user.get('/:userID', getMenus)

module.exports = user;
