const dbConfig = require('../util/deConfig')

// 获取支付信息(分页)
getPays = (req, res) => {
    console.log(req.query);
    const page = parseInt(req.query.page, 10) || 1; // 获取页码，默认为1  
    const limit = parseInt(req.query.limit, 10) || 5; // 获取每页数量，默认为5  
    // 计算偏移量，这里假设页码从1开始  
    const offset = (page - 1) * limit;

    if (req.query.orderID) {
        const { orderID } = req.query
        // 创建一个用于计算总数的SQL查询  
        let totalSql = `SELECT COUNT(*) as total FROM pay_records where orderID like '%${orderID}%'`;

        // 执行总数查询  
        dbConfig.sqlConnect(totalSql, [], (err, totalData) => {
            if (err) {
                console.log('连接出错了');
                res.status(500).send({ error: '查询出错了' });
                return;
            }

            const total = totalData[0].total; // 获取总数  

            // 创建一个用于获取当前页数据的SQL查询  
            let sql = `SELECT * FROM pay_records  where orderID like '%${orderID}%' ORDER BY payID LIMIT ${limit} OFFSET ${offset}`;

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
        let totalSql = "SELECT COUNT(*) as total FROM pay_records";

        // 执行总数查询  
        dbConfig.sqlConnect(totalSql, [], (err, totalData) => {
            if (err) {
                console.log('连接出错了');
                res.status(500).send({ error: '查询出错了' });
                return;
            }

            const total = totalData[0].total; // 获取总数  

            // 创建一个用于获取当前页数据的SQL查询  
            let sql = `SELECT * FROM pay_records ORDER BY payID LIMIT ${limit} OFFSET ${offset}`;

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

// 新增支付信息
insertPay = (req, res) => {
    console.log(req.body);
    let { orderID, payAmount, payStatus } = req.body
    let sql = `insert into pay_records (orderID, payAmount, payStatus) values (?, ?, ?)`
    let sqlArr = [orderID, payAmount, payStatus]

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

// 更新支付信息
updatePay = (req, res) => {
    let { payID } = req.params
    let { orderID, payAmount, payStatus } = req.body;

    let sql = `update pay_records set orderID=?, payAmount=?, payStatus=?  where payID=?`
    let sqlArr = [orderID, payAmount, payStatus, payID]

    let callBack = (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: '更新失败' });
        } else {
            console.log('更新成功:', data);
            res.send({ message: '更新成功' });
        }
    }

    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

// 删除指定支付
deletePay = (req, res) => {
    let { payID } = req.params;
    let sql1 = `select orderID from pay_records where payID=${payID}`
    dbConfig.sqlConnect(sql1, [], (err, result) => {
        if (err) {
            console.log(err);
            console.log('删除失败');
            res.status(500).send({ error: '删除失败' });
            return;
        }
        console.log(result);
        const { orderID } = result[0]
        let sql2 = `update rental_orders set orderStatus=${-1} where orderID = ${orderID}`
        dbConfig.sqlConnect(sql2, [], (err, result) => {
            if (err) {
                console.log(err);
                console.log('查询失败');
                res.status(500).send({ error: '查询失败' });
                return
            }
            let sql3 = `DELETE FROM pay_records WHERE payID=${payID}`
            dbConfig.sqlConnect(sql3, [], (err, result) => {
                if (err) {
                    console.log(err);
                    console.log('删除失败');
                    res.status(500).send({ error: '删除失败' });
                } else {
                    console.log('删除成功:', result);
                    res.send({ message: '删除成功' });
                }
            });
        });
    });
}

// 获取指定支付信息
getPayInfoByID = (req, res) => {
    console.log(req.query);
    const { payID } = req.query
    console.log(payID);
    let sql = `select * from pay_records where payID=?`
    let sqlArr = [payID]
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

// 获取所有订单ID
getPayByID = (req, res) => {
    let sql = `select orderID from rental_orders order by orderID `
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

// 获取客户支付信息(分页)
getPaysOfCustomer = (req, res) => {
    console.log(req.params);
    const page = parseInt(req.query.page, 10) || 1; // 获取页码，默认为1  
    const limit = parseInt(req.query.limit, 10) || 5; // 获取每页数量，默认为5  
    // 计算偏移量，这里假设页码从1开始  
    const offset = (page - 1) * limit;

    const { userID } = req.query
    // 创建一个用于计算总数的SQL查询  
    let totalSql = `SELECT COUNT(*) as total FROM pay_records p join rental_orders r on r.orderID = p.orderID where r.userID =${userID}`;

    // 执行总数查询  
    dbConfig.sqlConnect(totalSql, [], (err, totalData) => {
        if (err) {
            console.log('连接出错了');
            res.status(500).send({ error: '查询出错了' });
            return;
        }

        const total = totalData[0].total; // 获取总数  

        // 创建一个用于获取当前页数据的SQL查询  
        let sql = `SELECT p.* FROM pay_records p join rental_orders r on r.orderID = p.orderID where r.userID =${userID} ORDER BY payID LIMIT ${limit} OFFSET ${offset}`;

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



module.exports = {
    getPays,
    insertPay,
    getPayInfoByID,
    updatePay,
    deletePay,
    getPayByID,
    getPaysOfCustomer
}