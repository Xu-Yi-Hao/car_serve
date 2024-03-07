var express = require('express');
var car = express.Router();
const { getCars, getCarByID, getCarIsRent, insertCar, updateCar, deleteCar, getCarBrand, getCarType, getCarColor, } = require('../controllers/carController')


car.get('/', (req, res) => {
    if (req.query.carID) {
        getCarByID(req, res)
    } else {
        getCars(req, res)
    }
});


car.get('/brand', getCarBrand);
car.get('/isRent', getCarIsRent);
car.get('/type', getCarType);
car.get('/color', getCarColor);
car.get('/type/total', getTypeTotal);

car.post('', insertCar);
car.put('/:carID', updateCar);
car.delete('/:carID', deleteCar);






module.exports = car;
