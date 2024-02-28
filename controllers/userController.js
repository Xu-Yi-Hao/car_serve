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
        let sql = `SELECT * FROM sys_user ORDER BY userID LIMIT ${limit} OFFSET ${offset}`;

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

// 用户登录API路由  
login = (req, res) => {
    let { username, password } = req.body;
    // 构建SQL查询语句，这里假设有一个名为users的表，包含username和password字段  
    let sql = 'SELECT * FROM sys_user WHERE username = ? AND password = ?';
    let sqlArr = [username, password]; // 防止SQL注入，使用参数化查询  

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
        const token = jwt.sign({ username }, secretKey);
        // 返回令牌给客户端  
        res.send({ token, result });
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

// 查询所有用户名
allUsername = (req, res) => {
    let sql = 'select username from sys_user'
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

// 插入用户
insertUser = (req, res) => {
    console.log(req.body);
    let { username, name, gender, contactNumber, avatarUrl, password } = req.body
    let sql = `insert into sys_user (username, name, gender, contactNumber, avatarUrl, password) values (?, ?, ?, ?, ?, ?)`
    let sqlArr = [username, name, gender, contactNumber, avatarUrl, password]

    let callBack = (err, data) => {
        if (err) {
            console.log(err);
            console.log('插入出错了');
            res.status(500).send({ error: '插入失败' });
        } else {
            console.log('注册成功:', data);
            res.send({ message: '注册成功' });
        }
    }

    dbConfig.sqlConnect(sql, sqlArr, callBack)
}


module.exports = {
    getUsers,
    login,
    insertUser,
    allUsername
}