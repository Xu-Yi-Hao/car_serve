const userRouter = require("./users")
const carRouter = require('./car')
const employeeRouter = require('./employees')
const departmentRouter = require('./department')
const noticeRouter = require('./notice')
const roleRouter = require('./role')
const customerRouter = require('./customer')
const orderRouter = require('./order')
const upholdRouter = require('./uphold')
const payRouter = require('./pay')


module.exports = {
    userRouter,
    carRouter,
    employeeRouter,
    departmentRouter,
    noticeRouter,
    roleRouter,
    customerRouter,
    orderRouter,
    upholdRouter,
    payRouter,
}