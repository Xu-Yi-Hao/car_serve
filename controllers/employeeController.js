const dbConfig = require('../util/deConfig')

// 获取员工信息(分页，关键词搜索)
getEmployees = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1; // 获取页码，默认为1  
    const limit = parseInt(req.query.limit, 10) || 5; // 获取每页数量，默认为5  
    // 计算偏移量，这里假设页码从1开始  
    const offset = (page - 1) * limit;

    // 创建一个用于计算总数的SQL查询  
    let totalSql = "SELECT COUNT(*) as total FROM per_employee";

    // 执行总数查询  
    dbConfig.sqlConnect(totalSql, [], (err, totalData) => {
        if (err) {
            console.log('连接出错了');
            res.status(500).send({ error: '查询出错了' });
            return;
        }

        const total = totalData[0].total; // 获取总数  

        // 创建一个用于获取当前页数据的SQL查询  
        let sql = `SELECT e.*,d.departmentName FROM per_employee e JOIN per_department d ON e.departmentID = d.DepartmentID ORDER BY departmentID LIMIT ${limit} OFFSET ${offset}`;

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

// 获取所有职位信息
getPositions = (req, res) => {
    let { departmentID } = req.query
    let sql = `select DISTINCT position FROM per_employee where departmentID = ?`
    let sqlArr = [departmentID]
    let callBack = (err, data) => {
        if (err) {
            console.log('连接出错了');
        } else {
            res.send({ data })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

// 获取指定员工信息
getEmployeeByID = (req, res) => {
    const { employeeID } = req.query
    let sql = `select * from per_employee where employeeID=?`
    let sqlArr = [employeeID]
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

getEmployeeByName = (req, res) => {
    console.log(req.query);
    const { employeeName } = req.query
    let sql = `select e.*,d.departmentName FROM per_employee e JOIN per_department d ON e.departmentID = d.DepartmentID where employeeName like '%${employeeName}%'`
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
insertEmployee = (req, res) => {
    console.log(req.body);
    let { employeeName, position, contactNumber, departmentID } = req.body
    let sql = `insert into per_employee ( employeeName, position, contactNumber, departmentID) values (?, ?, ?, ?)`
    let sqlArr = [employeeName, position, contactNumber, departmentID]

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
updateEmployee = (req, res) => {
    let { employeeID } = req.params
    let { employeeName, position, contactNumber, departmentID } = req.body;

    let sql = `update per_employee set employeeName=?, position=?, contactNumber=?, departmentID=? where employeeID=?`
    let sqlArr = [employeeName, position, contactNumber, departmentID, employeeID]

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
deleteEmployee = (req, res) => {
    let { employeeID } = req.params;
    let sql = `DELETE FROM per_employee WHERE employeeID=?`
    let sqlArr = [employeeID]
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
    getEmployees,
    getPositions,
    getEmployeeByID,
    getEmployeeByName,
    insertEmployee,
    updateEmployee,
    deleteEmployee
}