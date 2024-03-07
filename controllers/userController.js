const dbConfig = require('../util/deConfig')
const jwt = require('jsonwebtoken')
// 设置JWT密钥  
const secretKey = 'cars';
// 获取用户信息
getUsers = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1; // 获取页码，默认为1  
    const limit = parseInt(req.query.limit, 10) || 5; // 获取每页数量，默认为5  
    // 计算偏移量，这里假设页码从1开始  
    const offset = (page - 1) * limit;

    if (req.query.username) {
        const username = req.query.username
        // 创建一个用于计算总数的SQL查询  
        let totalSql = `SELECT COUNT(*) as total FROM sys_user where username like '%${username}%'`;

        // 执行总数查询  
        dbConfig.sqlConnect(totalSql, [], (err, totalData) => {
            if (err) {
                console.log('连接出错了');
                res.status(500).send({ error: '查询出错了' });
                return;
            }

            const total = totalData[0].total; // 获取总数  

            // 创建一个用于获取当前页数据的SQL查询  
            let sql = `SELECT u.*,r.roleName  
            FROM sys_user_role ur  
            JOIN sys_role r ON ur.roleID = r.roleID  
            JOIN sys_user u ON ur.userID = u.userID  
            ORDER BY u.userID where u.username like '%${username}%' ORDER BY userID LIMIT ${limit} OFFSET ${offset}`;

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
        let totalSql = "SELECT COUNT(*) as total FROM sys_user";

        // 执行总数查询  
        dbConfig.sqlConnect(totalSql, [], (err, totalData) => {
            if (err) {
                console.log('连接出错了');
                res.status(500).send({ error: '查询出错了' });
                return;
            }

            const total = totalData[0].total; // 获取总数  

            // 创建一个用于获取当前页数据的SQL查询  
            let sql = `SELECT u.*,r.roleName  
            FROM sys_user_role ur  
            JOIN sys_role r ON ur.roleID = r.roleID  
            JOIN sys_user u ON ur.userID = u.userID  
            ORDER BY u.userID LIMIT ${limit} OFFSET ${offset}`;

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

// 用户登录API路由  
login = (req, res) => {
    let { contactNumber, password } = req.body;
    // 构建SQL查询语句，这里假设有一个名为users的表，包含username和password字段  
    let sql = 'SELECT * FROM sys_user WHERE contactNumber = ? AND password = ?';
    let sqlArr = [contactNumber, password]; // 防止SQL注入，使用参数化查询  

    let callBack = (err, result) => {
        if (err) {
            // 处理数据库连接错误或其他错误  
            return res.status(500).send({ error: '数据库连接失败' });
        }

        if (result.length === 0) {
            // 用户不存在或密码错误  
            return res.status(401).send({ error: '用户不存在或密码错误' });
        }
        // 用户验证成功，生成JWT令牌  
        const token = jwt.sign({ contactNumber }, secretKey);
        // 返回令牌给客户端  
        res.send({ token, result });
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

// 更改密码
updatePwd = (req, res) => {
    let { userID } = req.params
    let { password } = req.body;
    let sql = `update sys_user set password=? where userID=?`
    let sqlArr = [password, userID]

    let callBack = (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: '更改密码失败' });
        } else {
            console.log('更新成功:', data);
            res.send({ message: '更改密码成功,请重新登录' });
        }
    }

    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

// 插入用户
insertUser = (req, res) => {
    let { username, name, roleID, gender, contactNumber, avatarUrl, password } = req.body;
    // 准备SQL语句模板  
    let sql1 = `insert into sys_user (username, name, gender, contactNumber, avatarUrl, password) values (?, ?, ?, ?, ?, ?)`;
    let sql2 = `select userID from sys_user where contactNumber=?`
    let sql3 = `INSERT IGNORE INTO sys_user_role (userID, roleID) VALUES (?,${roleID})`;

    let sqlArr1 = [username, name, gender, contactNumber, avatarUrl, password]
    // 执行删除操作  
    dbConfig.sqlConnect(sql1, sqlArr1, (err, result) => {
        if (err) {
            console.log(err);
            console.log('插入用户分配失败');
            res.status(500).send({ error: '插入用户分配失败' });
            return;
        }

        // 执行插入操作  
        dbConfig.sqlConnect(sql2, [contactNumber], (err, result) => {
            if (err) {
                console.log(err);
                console.log('插入角色失败');
                res.status(500).send({ error: '插入角色失败' });
                return
            }
            console.log(result);
            const { userID } = result[0]
            // 执行插入操作  
            dbConfig.sqlConnect(sql3, [userID], (err, result) => {
                if (err) {
                    console.log(err);
                    console.log('插入角色失败');
                    res.status(500).send({ error: '插入角色失败' });
                } else {
                    console.log('注册成功:', result);
                    res.send({ message: '注册成功' });
                }
            });

        });
    });
}

// 获取菜单
getMenus = (req, res) => {
    const { userID } = req.query
    // 创建一个用于获取当前页数据的SQL查询  
    let sql = `SELECT DISTINCT m.*  
    FROM sys_user_role ur  
    JOIN sys_role r ON ur.roleID = r.roleID  
    JOIN sys_role_menu rm ON r.roleID = rm.roleID  
    JOIN sys_menu m ON rm.menuID = m.menuID  
    WHERE ur.userID = ? ORDER BY m.menuID;`;
    const sqlArr = [userID]
    // 执行当前页数据查询  
    dbConfig.sqlConnect(sql, sqlArr, (err, data) => {
        if (err) {
            console.log('连接出错了');
            res.status(500).send({ error: '查询出错了' });
        } else {
            // 将总数和当前页数据一起返回  
            res.send({ data });
        }
    });
}

// 获取指定用户信息
getUserByID = (req, res) => {
    const { userID } = req.query
    let sql = `SELECT   
    u.*,  
    r.roleID,  
    r.roleName  
FROM   
    sys_user u  
JOIN   
    sys_user_role ur ON u.userID = ur.userID  
JOIN   
    sys_role r ON ur.roleID = r.roleID  
WHERE   
    u.userID = ?;`
    let sqlArr = [userID]
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

// 更新用户信息
updateUser = (req, res) => {
    let { userID } = req.params
    let { username, name, gender, avatarUrl } = req.body;

    let sql = `update sys_user set username=?, name=?, gender=?, avatarUrl=? where userID=?`
    let sqlArr = [username, name, gender, avatarUrl, userID]

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

// 分配角色信息
selectRoleForUser = (req, res) => {
    let { userID, data } = req.body;
    let result = ""; // 初始化一个空字符串来存储最终结果  
    // 遍历数组，构建最终字符串  
    for (let i = 0; i < data.length; i++) {
        // 构建当前元素的字符串表示  
        let itemString = `(${userID},${data[i]})`;

        // 如果不是最后一个元素，则在字符串末尾添加中文逗号  
        if (i < data.length - 1) {
            result += itemString + ",";
        } else {
            // 如果是最后一个元素，则直接添加字符串到结果中，不添加逗号  
            result += itemString;
        }
    }
    // 准备SQL语句模板  
    let deleteSql = `DELETE FROM sys_user_role WHERE userID = ${userID}`;
    let insertSql = `INSERT IGNORE INTO sys_user_role (userID, roleID) VALUES ${result}`;

    // 执行删除操作  
    dbConfig.sqlConnect(deleteSql, [], (err, result) => {
        if (err) {
            console.log(err);
            console.log('删除角色分配失败');
            res.status(500).send({ error: '删除角色分配失败' });
            return;
        }
        console.log('删除角色分配成功', result);

        // 执行插入操作  
        dbConfig.sqlConnect(insertSql, [], (err, result) => {
            if (err) {
                console.log(err);
                console.log('插入角色分配失败');
                res.status(500).send({ error: '插入角色分配失败' });
            } else {
                console.log('插入角色分配成功:', result);
                res.send({ message: '角色分配成功' });
            }
        });
    });
}

// 查询用户已有角色
getRoleOfUser = (req, res) => {
    let { userID } = req.query;
    console.log(userID);
    // 准备SQL语句模板  
    let sql = `select roleID from sys_user_role where userID=?`;
    let sqlArr = [userID]
    let callBack = (err, data) => {
        console.log(data);
        if (err) {
            console.log(err);
            console.log('连接出错了');
        } else {
            res.send({ data })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

// 删除指定用户
deleteUser = (req, res) => {
    let { userID } = req.params;
    // 准备SQL语句模板  
    let deleteSql1 = `DELETE FROM sys_user_role WHERE userID = ${userID}`;
    let deleteSql2 = `DELETE FROM sys_user WHERE userID=${userID}`;

    // 执行删除操作  
    dbConfig.sqlConnect(deleteSql1, [], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: '删除角色失败' });
            return;
        }
        // 执行插入操作  
        dbConfig.sqlConnect(deleteSql2, [], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ error: '删除失败' });
            } else {
                res.send({ message: '删除成功' });
            }
        });
    });
}

// 查询用户所有电话号码
getAllNumber = (req, res) => {
    // 准备SQL语句模板  
    let sql = `select contactNumber from sys_user`;
    let sqlArr = []
    let callBack = (err, data) => {
        console.log(data);
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
    getUsers,
    login,
    updatePwd,
    insertUser,
    getMenus,
    getUserByID,
    updateUser,
    selectRoleForUser,
    deleteUser,
    getRoleOfUser,
    getAllNumber
}