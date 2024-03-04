var express = require('express');
var uphold = express.Router();
const { getUpholds,
    insertUphold,
    updateUphold,
    deleteUphold, } = require('../controllers/upholdController')

// /* GET upholds listing. */
uphold.get('/', getUpholds);
uphold.post('/', insertUphold);
uphold.put('/:upholdID', updateUphold);
uphold.delete('/:upholdID', deleteUphold);

module.exports = uphold;
