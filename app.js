var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const { userRouter,
  carRouter,
  employeeRouter,
  departmentRouter,
  noticeRouter,
  roleRouter,
  maintainRouter,
  customerRouter,
  orderRouter,
  returnRouter,
  payRouter, } = require('./routes/index');

var app = express();


// 改写
var http = require('http');
const user = require('./routes/users');
var server = http.createServer(app);
// 使用cors
app.use(cors())
app.use(express.json()); // 用于解析JSON请求体  
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 静态资源
app.use(express.static(path.join(__dirname, 'public')));
// post请求
app.use(express.urlencoded({ extended: true }))


app.use('/car', carRouter);
app.use('/user', userRouter);
app.use('/employee', employeeRouter);
app.use('/department', departmentRouter);
app.use('/notice', noticeRouter);
app.use('/role', roleRouter);
app.use('/maintain', maintainRouter);
app.use('/customer', customerRouter);
app.use('/order', orderRouter);
app.use('/return', returnRouter);
app.use('/pay', payRouter);



server.setTimeout(60 * 1000)
server.listen('3000', () => {
  console.log(`服务器正在监听端口 http://localhost:3000`);
})
