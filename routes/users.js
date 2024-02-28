var express = require('express');
var user = express.Router();
const { getUsers, login, allUsername, insertUser } = require('../controllers/userController')

/* GET users listing. */
user.get('/', getUsers);
user.get('/username', allUsername);
user.post('/login', login);
user.post('/', insertUser)


module.exports = user;
