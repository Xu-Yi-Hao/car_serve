var express = require('express');
var pay = express.Router();
const { getPays,
    insertPay,
    updatePay,
    deletePay, getPayByID, getPayInfoByID } = require('../controllers/payController')

/* GET pays listing. */
pay.get('/', (req, res) => {
    console.log(req.query.payID);
    if (req.query.payID) {
        console.log(1111);
        getPayInfoByID(req, res)
    } else {
        getPays(req, res)
    }
});

pay.get('/orderID', getPayByID)
pay.post('/', insertPay);
pay.put('/:payID', updatePay);
pay.delete('/:payID', deletePay);

module.exports = pay;
