const dbConfig = require('../util/deConfig')

// 获取员工信息(分页，关键词搜索)
getCustomers = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1; // 获取页码，默认为1  
    const limit = parseInt(req.query.limit, 10) || 5; // 获取每页数量，默认为5  
    // 计算偏移量，这里假设页码从1开始  
    const offset = (page - 1) * limit;

    // 创建一个用于计算总数的SQL查询  
    let totalSql = "SELECT COUNT(*) as total FROM customer";

    // 执行总数查询  
    dbConfig.sqlConnect(totalSql, [], (err, totalData) => {
        if (err) {
            console.log('连接出错了');
            res.status(500).send({ error: '查询出错了' });
            return;
        }

        const total = totalData[0].total; // 获取总数  

        // 创建一个用于获取当前页数据的SQL查询  
        let sql = `SELECT * FROM customer ORDER BY customerID LIMIT ${limit} OFFSET ${offset}`;

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

// 获取指定员工信息
getCustomerByID = (req, res) => {
    const { customerID } = req.query
    let sql = `select * from customer where customerID=?`
    let sqlArr = [customerID]
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

getCustomerByName = (req, res) => {
    console.log(req.query);
    const { name } = req.query
    let sql = `select * FROM customer where name like '%${name}%'`
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

// 新增员工信息
insertCustomer = (req, res) => {
    console.log(req.body);
    let { name, gender, age, contactNumber, city } = req.body
    let sql = `insert into customer ( name, gender, age, contactNumber, city) values (?, ?, ?, ?, ?)`
    let sqlArr = [name, gender, age, contactNumber, city]

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

// 更新员工信息
updateCustomer = (req, res) => {
    let { customerID } = req.params
    let { name, gender, age, contactNumber, city } = req.body;

    let sql = `update customer set name=?, gender=?, age=?, contactNumber=?, city=? where customerID=?`
    let sqlArr = [name, gender, age, contactNumber, city, customerID]

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

// 删除指定员工
deleteCustomer = (req, res) => {
    let { customerID } = req.params;
    let sql = `DELETE FROM customer WHERE customerID=?`
    let sqlArr = [customerID]
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
    getCustomers,
    getCustomerByID,
    getCustomerByName,
    insertCustomer,
    updateCustomer,
    deleteCustomer
}