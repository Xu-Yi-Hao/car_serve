const dbConfig = require('../util/deConfig')

// 获取订单信息(分页)
getOrders = (req, res) => {
    console.log(req.query);
    const page = parseInt(req.query.page, 10) || 1; // 获取页码，默认为1  
    const limit = parseInt(req.query.limit, 10) || 5; // 获取每页数量，默认为5  
    // 计算偏移量，这里假设页码从1开始  
    const offset = (page - 1) * limit;
    if (req.query.name) {
        const name = req.query.name
        // 创建一个用于计算总数的SQL查询  
        let totalSql = `SELECT count(*) as total from rental_orders re
        JOIN sys_user u on re.userID = u.userID WHERE u.name LIKE '%${name}%'`;

        // 执行总数查询  
        dbConfig.sqlConnect(totalSql, [], (err, totalData) => {
            if (err) {
                console.log('连接出错了');
                res.status(500).send({ error: '查询出错了' });
                return;
            }
            console.log(totalData);
            const total = totalData[0].total; // 获取总数  

            // 创建一个用于获取当前页数据的SQL查询  
            let sql = `SELECT re.*,car.plateNumber,u.name,u.contactNumber from rental_orders re
     JOIN car on re.carID = car.carID
     JOIN sys_user u on re.userID = u.userID WHERE u.name LIKE '%${name}%' ORDER BY orderID LIMIT ${limit} OFFSET ${offset}`;

            // 执行当前页数据查询  
            dbConfig.sqlConnect(sql, [], (err, data) => {
                if (err) {
                    console.log(err);
                    console.log('连接出错了');
                    res.status(500).send({ error: '查询出错了' });
                } else {
                    // 将总数和当前页数据一起返回  
                    res.send({ total, data });
                }
            });
        });
    } else {
        // 创建一个用于计算总数的SQL查询  
        let totalSql = "SELECT COUNT(*) as total FROM rental_orders";

        // 执行总数查询  
        dbConfig.sqlConnect(totalSql, [], (err, totalData) => {
            if (err) {
                console.log('连接出错了');
                res.status(500).send({ error: '查询出错了' });
                return;
            }

            const total = totalData[0].total; // 获取总数  

            // 创建一个用于获取当前页数据的SQL查询  
            let sql = `SELECT re.*,car.plateNumber,u.name,u.contactNumber from rental_orders re
     JOIN car on re.carID = car.carID
     JOIN sys_user u on re.userID = u.userID ORDER BY orderID LIMIT ${limit} OFFSET ${offset}`;

            // 执行当前页数据查询  
            dbConfig.sqlConnect(sql, [], (err, data) => {
                if (err) {
                    console.log('连接出错了');
                    res.status(500).send({ error: '查询出错了' });
                } else {
                    // 将总数和当前页数据一起返回  
                    res.send({ total, data });
                }
            });
        });
    }

}

// 获取指定订单信息
getOrderByID = (req, res) => {
    const { orderID } = req.query
    let sql = `select  re.*,car.plateNumber,c.name,c.contactNumber from rental_orders re
    JOIN car on re.carID = car.carID
    JOIN sys_user c on re.userID = c.userID where orderID=?`
    let sqlArr = [orderID]
    let callBack = (err, data) => {
        if (err) {
            console.log(err);
            console.log('连接出错了');
        } else {
            res.send({ data })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

// 新增订单信息
insertOrder = (req, res) => {
    let { userID, carID, orderStatus, rentalDate, returnDate, payAmount, payStatus } = req.body
    console.log(userID, carID, orderStatus, rentalDate, returnDate, payAmount, payStatus);
    let sql1 = `insert into rental_orders ( userID, carID, orderStatus, rentalDate, returnDate) values (?, ?, ?, ?, ?)`
    let sql2 = `select orderID from rental_orders where userID=? and carID=? and orderStatus =? and rentalDate=? and returnDate=?`
    let sqlArr1 = [userID, carID, orderStatus, rentalDate, returnDate]
    dbConfig.sqlConnect(sql1, sqlArr1, (err, result) => {
        if (err) {
            console.log(err);
            console.log('插入失败');
            res.status(500).send({ error: '插入失败' });
            return;
        }
        dbConfig.sqlConnect(sql2, sqlArr1, (err, result) => {
            if (err) {
                console.log(err);
                console.log('查询失败');
                res.status(500).send({ error: '查询失败' });
            }
            console.log(result);
            const { orderID } = result[0]
            // const payStatus = 1
            let sql3 = `insert into pay_records ( orderID, payAmount, payStatus) values (${orderID}, ?, ?)`
            let sqlArr2 = [payAmount, 1]
            dbConfig.sqlConnect(sql3, sqlArr2, (err, result) => {
                if (err) {
                    console.log(err);
                    console.log('插入失败');
                    res.status(500).send({ error: '插入失败' });
                } else {
                    console.log('插入成功:', result);
                    res.send({ message: '插入成功' });
                }
            });
        });
    });
}

// 更新订单信息
// 假设 dbConfig 是一个包含数据库配置的对象  
// 假设 dbConfig.sqlConnect 是一个用于执行SQL查询的函数，它接受SQL语句、参数数组和回调函数作为参数  

updateOrder = (req, res) => {
    const { orderID } = req.params;
    const { userID, carID, orderStatus, rentalDate, returnDate } = req.body;

    // 更新订单的SQL语句和参数  
    const updateOrderSql = `  
            UPDATE rental_orders  
            SET userID=?, carID=?, orderStatus=?, rentalDate=?, returnDate=?  
            WHERE orderID=?  
        `;
    const updateOrderParams = [userID, carID, orderStatus, rentalDate, returnDate, orderID];

    // 计算租赁日期的差值（天数）  
    const dateDiff = (new Date(returnDate) - new Date(rentalDate)) / (1000 * 60 * 60 * 24);

    // 获取车辆价格和押金的函数  
    const getCarDetails = (callback) => {
        const getCarSql = `SELECT price, deposit FROM car WHERE carID=?`;
        dbConfig.sqlConnect(getCarSql, [carID], (err, results) => {
            if (err || results.length === 0) {
                callback(err || new Error('没有找到匹配的车辆'));
            } else {
                const { price, deposit } = results[0];
                callback(null, { price, deposit });
            }
        });
    };

    // 执行更新订单的SQL语句  
    dbConfig.sqlConnect(updateOrderSql, updateOrderParams, (err, orderUpdateResult) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: '更新订单失败' });
        }

        console.log('订单更新成功');

        // 获取车辆价格和押金  
        getCarDetails((err, carDetails) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: '获取车辆信息失败' });
            }

            // 计算总金额（价格 * 天数 + 押金）  
            const totalAmount = carDetails.price * dateDiff + carDetails.deposit;

            // 更新支付表的SQL语句和参数  
            const updatePaymentSql = `  
                    UPDATE pay_records  
                    SET payAmount = ?  
                    WHERE orderID = ?  
                `;
            const updatePaymentParams = [totalAmount, orderID];

            // 执行更新支付表的SQL语句  
            dbConfig.sqlConnect(updatePaymentSql, updatePaymentParams, (err, paymentUpdateResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ error: '更新支付失败' });
                }

                console.log('支付更新成功');
                res.send({ message: '更新成功' });
            });
        });
    });
};
// 删除指定订单信息
deleteOrder = (req, res) => {
    let { orderID } = req.params;
    // 准备SQL语句模板  
    let sql1 = `DELETE FROM pay_records WHERE orderID=${orderID}`;
    let sql2 = `DELETE FROM rental_orders WHERE orderID = ${orderID}`;

    // 执行删除操作  
    dbConfig.sqlConnect(sql1, [], (err, result) => {
        if (err) {
            console.log(err);
            console.log('删除失败');
            res.status(500).send({ error: '删除失败' });
            return;
        }
        console.log('删除成功', result);
        dbConfig.sqlConnect(sql2, [], (err, result) => {
            if (err) {
                console.log(err);
                console.log('删除失败');
                res.status(500).send({ error: '删除失败' });
                return
            } else {
                console.log('删除成功:', result);
                res.send({ message: '删除成功' });
            }
        });
    });
}

// 获取所有用户名
getCustomerList = (req, res) => {
    let sql = `select userID,name,contactNumber FROM sys_user`
    let sqlArr = []
    let callBack = (err, data) => {
        if (err) {
            console.log('连接出错了');
        } else {
            res.send({ data })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

// 获取所有车辆
getCarList = (req, res) => {
    let sql = `select carID,plateNumber FROM car`
    let sqlArr = []
    let callBack = (err, data) => {
        if (err) {
            console.log('连接出错了');
        } else {
            res.send({ data })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

// 获取所有完成订单信息
getOrderAndBrand = (req, res) => {
    let sql = `SELECT car.brand, COUNT(o.orderID) AS total_orders  
FROM   
    car 
JOIN   
    rental_orders o ON car.carID = o.carID  
WHERE   
    o.orderStatus = 1
GROUP BY   
    car.brand;`
    let sqlArr = []
    let callBack = (err, data) => {
        if (err) {
            console.log(err);
            console.log('连接出错了');
        } else {
            res.send({ data })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

module.exports = {
    getOrders,
    getOrderByID,
    insertOrder,
    updateOrder,
    deleteOrder,
    getCustomerList,
    getCarList,
    getOrderAndBrand
}