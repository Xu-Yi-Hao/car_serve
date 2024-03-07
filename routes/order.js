var express = require('express');
var order = express.Router();
const { getOrders,
    getOrderByID,
    insertOrder,
    updateOrder,
    deleteOrder, getCustomerList, getCarList, getOrderAndBrand } = require('../controllers/orderController')

/* GET orders listing. */
order.get('/', (req, res) => {
    if (req.query.orderID) {
        getOrderByID(req, res)
    } else {
        getOrders(req, res)
    }
});

order.get('/customer', getCustomerList)
order.get('/car', getCarList)
order.get('/brand', getOrderAndBrand)

order.post('/', insertOrder);
order.put('/:orderID', updateOrder);
order.delete('/:orderID', deleteOrder);

module.exports = order;
