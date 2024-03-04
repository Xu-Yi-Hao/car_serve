const dbConfig = require('../util/deConfig')

// 获取角色信息(分页)
getRoles = (req, res) => {
    console.log(req.query);
    const page = parseInt(req.query.page, 10) || 1; // 获取页码，默认为1  
    const limit = parseInt(req.query.limit, 10) || 5; // 获取每页数量，默认为5  
    // 计算偏移量，这里假设页码从1开始  
    const offset = (page - 1) * limit;

    if (req.query.roleName) {
        const { roleName } = req.query
        // 创建一个用于计算总数的SQL查询  
        let totalSql = `SELECT COUNT(*) as total FROM sys_role where roleName like '%${roleName}%'`;

        // 执行总数查询  
        dbConfig.sqlConnect(totalSql, [], (err, totalData) => {
            if (err) {
                console.log('连接出错了');
                res.status(500).send({ error: '查询出错了' });
                return;
            }

            const total = totalData[0].total; // 获取总数  

            // 创建一个用于获取当前页数据的SQL查询  
            let sql = `SELECT * FROM sys_role where roleName like '%${roleName}%' ORDER BY roleID LIMIT ${limit} OFFSET ${offset}`;

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
        let totalSql = "SELECT COUNT(*) as total FROM sys_role";

        // 执行总数查询  
        dbConfig.sqlConnect(totalSql, [], (err, totalData) => {
            if (err) {
                console.log('连接出错了');
                res.status(500).send({ error: '查询出错了' });
                return;
            }

            const total = totalData[0].total; // 获取总数  

            // 创建一个用于获取当前页数据的SQL查询  
            let sql = `SELECT * FROM sys_role ORDER BY roleID LIMIT ${limit} OFFSET ${offset}`;

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


// 新增角色信息
insertRole = (req, res) => {
    console.log(req.body);
    let { roleName, roleDesc } = req.body
    let sql = `insert into sys_role (roleName, roleDesc) values (?, ?)`
    let sqlArr = [roleName, roleDesc]

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

// 更新角色信息
updateRole = (req, res) => {
    let { roleID } = req.params
    let { roleName, roleDesc } = req.body;

    let sql = `update sys_role set roleName=?, roleDesc=? where roleID=?`
    let sqlArr = [roleName, roleDesc, roleID]

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

// 删除指定角色
deleteRole = (req, res) => {
    let { roleID } = req.params;
    let sql = `DELETE FROM sys_role WHERE roleID=?`
    let sqlArr = [roleID]
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
    getRoles,
    insertRole,
    updateRole,
    deleteRole,
}