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
        JOIN customer c on re.customerID = c.customerID WHERE c.name LIKE '%${name}%'`;

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
            let sql = `SELECT re.*,car.plateNumber,c.name,c.contactNumber from rental_orders re
     JOIN car on re.carID = car.carID
     JOIN customer c on re.customerID = c.customerID WHERE c.name LIKE '%${name}%' ORDER BY orderID LIMIT ${limit} OFFSET ${offset}`;

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
            let sql = `SELECT re.*,car.plateNumber,c.name,c.contactNumber from rental_orders re
     JOIN car on re.carID = car.carID
     JOIN customer c on re.customerID = c.customerID ORDER BY orderID LIMIT ${limit} OFFSET ${offset}`;

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
    JOIN customer c on re.customerID = c.customerID where orderID=?`
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
    let { customerID, carID, orderStatus, rentalDate, returnDate } = req.body
    let sql = `insert into rental_orders ( customerID, carID, orderStatus, rentalDate, returnDate) values (?, ?, ?, ?, ?)`
    let sqlArr = [customerID, carID, orderStatus, rentalDate, returnDate]

    let callBack = (err, data) => {
        if (err) {
            console.log(err);
            console.log('插入出错了');
            res.status(500).send({ error: '插入失败' });
        } else {
            console.log('插入成功:', data);
            res.send({ message: '插入成功' });
        }
    }

    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

// 更新订单信息
updateOrder = (req, res) => {
    let { orderID } = req.params
    let { customerID, carID, orderStatus, rentalDate, returnDate } = req.body;

    let sql = `update rental_orders set customerID=?, carID=?, orderStatus=?, rentalDate=?, returnDate=? where orderID=?`
    let sqlArr = [customerID, carID, orderStatus, rentalDate, returnDate, orderID]

    let callBack = (err, data) => {
        if (err) {
            console.log(err);
            console.log('更新出错了');
            res.status(500).send({ error: '更新失败' });
        } else {
            console.log('更新成功:', data);
            res.send({ message: '更新成功' });
        }
    }

    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

// 删除指定订单信息
deleteOrder = (req, res) => {
    let { orderID } = req.params;
    let sql = `DELETE FROM rental_orders WHERE orderID=?`
    let sqlArr = [orderID]
    let callBack = (err, data) => {
        if (err) {
            console.log(err);
            console.log('删除出错了');
            // 如果删除失败，发送错误响应  
            res.status(500).send({ error: '删除失败' });
        } else {
            console.log('删除成功:', data);
            // 如果删除成功，发送成功响应  
            res.send({ message: '删除成功' });
        }
    }

    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

// 获取所有用户名
getCustomerList = (req, res) => {
    let sql = `select customerID,name,contactNumber FROM customer`
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

// 获取所有用户名
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

module.exports = {
    getOrders,
    getOrderByID,
    insertOrder,
    updateOrder,
    deleteOrder,
    getCustomerList,
    getCarList
}