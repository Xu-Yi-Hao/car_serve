var express = require('express');
var customer = express.Router();
const { getCustomers,
    getCustomerByID,
    getCustomerByName,
    insertCustomer,
    updateCustomer,
    deleteCustomer } = require('../controllers/customerController')

/* GET customers listing. */
customer.get('/', (req, res) => {
    if (req.query.customerID) {
        getCustomerByID(req, res)
    } else if (req.query.name) {
        getCustomerByName(req, res)
    } else {
        getCustomers(req, res)
    }
});

customer.post('/', insertCustomer);
customer.put('/:customerID', updateCustomer);
customer.delete('/:customerID', deleteCustomer);

module.exports = customer;
