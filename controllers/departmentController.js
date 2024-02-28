const dbConfig = require('../util/deConfig')

// 获取部门信息(分页)
getDepartments = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1; // 获取页码，默认为1  
    const limit = parseInt(req.query.limit, 10) || 5; // 获取每页数量，默认为5  
    // 计算偏移量，这里假设页码从1开始  
    const offset = (page - 1) * limit;

    // 创建一个用于计算总数的SQL查询  
    let totalSql = "SELECT COUNT(*) as total FROM per_department";

    // 执行总数查询  
    dbConfig.sqlConnect(totalSql, [], (err, totalData) => {
        if (err) {
            console.log('连接出错了');
            res.status(500).send({ error: '查询出错了' });
            return;
        }

        const total = totalData[0].total; // 获取总数  

        // 创建一个用于获取当前页数据的SQL查询  
        let sql = `SELECT * FROM per_department ORDER BY departmentID LIMIT ${limit} OFFSET ${offset}`;

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

// 获取指定部门信息
getDepartmentByName = (req, res) => {
    const { departmentName } = req.query
    let sql = `select * from per_department where departmentName like '%${departmentName}%'`
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

// 新增部门信息
insertDep = (req, res) => {
    console.log(req.body);
    let { departmentName, description } = req.body
    let sql = `insert into per_department (departmentName, description) values (?, ?)`
    let sqlArr = [departmentName, description]

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

// 更新部门信息
updateDep = (req, res) => {
    let { departmentID } = req.params
    let { departmentName, description } = req.body;

    let sql = `update per_department set departmentName=?, description=? where departmentID=?`
    let sqlArr = [departmentName, description, departmentID]

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

// 删除指定部门
deleteDep = (req, res) => {
    let { departmentID } = req.params;
    let sql = `DELETE FROM per_department WHERE departmentID=?`
    let sqlArr = [departmentID]
    let callBack = (err, data) => {
        if (err) {
            res.status(500).send({ error: '删除失败' });
        } else {
            res.send({ message: '删除成功' });
        }
    }

    dbConfig.sqlConnect(sql, sqlArr, callBack)
}


module.exports = {
    getDepartments,
    getDepartmentByName,
    insertDep,
    updateDep,
    deleteDep,
}