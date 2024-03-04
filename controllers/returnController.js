const dbConfig = require('../util/deConfig')

// 获取归还信息(分页)
getReturns = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1; // 获取页码，默认为1  
    const limit = parseInt(req.query.limit, 10) || 5; // 获取每页数量，默认为5  
    // 计算偏移量，这里假设页码从1开始  
    const offset = (page - 1) * limit;

    // 创建一个用于计算总数的SQL查询  
    let totalSql = "SELECT COUNT(*) as total FROM car_return";

    // 执行总数查询  
    dbConfig.sqlConnect(totalSql, [], (err, totalData) => {
        if (err) {
            console.log('连接出错了');
            res.status(500).send({ error: '查询出错了' });
            return;
        }

        const total = totalData[0].total; // 获取总数  

        // 创建一个用于获取当前页数据的SQL查询  
        let sql = `SELECT re.*,car.plateNumber,c.name,c.contactNumber from car_return re
        JOIN car on re.carID = car.carID
        JOIN customer c on re.customerID = c.customerID ORDER BY returnID LIMIT ${limit} OFFSET ${offset}`;

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

// 获取指定归还信息
getReturnByID = (req, res) => {
    const { returnID } = req.query
    let sql = `select  re.*,car.plateNumber,c.name,c.contactNumber from car_return re
    JOIN car on re.carID = car.carID
    JOIN customer c on re.customerID = c.customerID where returnID=?`
    let sqlArr = [returnID]
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

// 新增归还信息
insertReturn = (req, res) => {
    console.log(req.body);
    let { customerID, carID, borrow_data, return_data } = req.body
    let sql = `insert into car_return ( customerID, carID, borrow_data, return_data) values (?, ?, ?, ?)`
    let sqlArr = [customerID, carID, borrow_data, return_data]

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

// 更新归还信息
updateReturn = (req, res) => {
    let { returnID } = req.params
    let { customerID, carID, borrow_data, return_data } = req.body;

    let sql = `update car_return set customerID=?, carID=?, borrow_data=?, return_data=? where returnID=?`
    let sqlArr = [customerID, carID, borrow_data, return_data, returnID]

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

// 删除指定归还信息
deleteReturn = (req, res) => {
    let { returnID } = req.params;
    let sql = `DELETE FROM car_return WHERE returnID=?`
    let sqlArr = [returnID]
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


module.exports = {
    getReturns,
    getReturnByID,
    insertReturn,
    updateReturn,
    deleteReturn,
}