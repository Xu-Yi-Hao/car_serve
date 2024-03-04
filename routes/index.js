const userRouter = require("./users")
const carRouter = require('./car')
const employeeRouter = require('./employees')
const departmentRouter = require('./department')
const noticeRouter = require('./notice')
const roleRouter = require('./role')
const maintainRouter = require('./maintain')
const customerRouter = require('./customer')
const orderRouter = require('./order')
const returnRouter = require('./return')
const payRouter = require('./pay')


module.exports = {
    userRouter,
    carRouter,
    employeeRouter,
    departmentRouter,
    noticeRouter,
    roleRouter,
    maintainRouter,
    customerRouter,
    orderRouter,
    returnRouter,
    payRouter,
}