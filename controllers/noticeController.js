const dbConfig = require('../util/deConfig')

// 获取公告信息(分页)
getNotices = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1; // 获取页码，默认为1  
    const limit = parseInt(req.query.limit, 10) || 5; // 获取每页数量，默认为5  
    // 计算偏移量，这里假设页码从1开始  
    const offset = (page - 1) * limit;

    // 创建一个用于计算总数的SQL查询  
    let totalSql = "SELECT COUNT(*) as total FROM sys_notices";

    // 执行总数查询  
    dbConfig.sqlConnect(totalSql, [], (err, totalData) => {
        if (err) {
            console.log('连接出错了');
            res.status(500).send({ error: '查询出错了' });
            return;
        }

        const total = totalData[0].total; // 获取总数  

        // 创建一个用于获取当前页数据的SQL查询  
        let sql = `SELECT n.*,u.username FROM sys_notices n JOIN sys_user u ON n.userID = u.userID ORDER BY noticeID LIMIT ${limit} OFFSET ${offset}`;

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

// 获取指定公告信息
getNoticeByID = (req, res) => {
    const { noticeID } = req.query
    let sql = `select * from sys_notices where noticeID=?`
    let sqlArr = [noticeID]
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

// 新增公告信息
insertNotice = (req, res) => {
    console.log(req.body);
    let { title, content, release_date, userID } = req.body
    let sql = `insert into sys_notices (title, content, release_date, userID) values (?, ?, ?, ?)`
    let sqlArr = [title, content, release_date, userID]

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

// 更新公告信息
updateNotice = (req, res) => {
    let { noticeID } = req.params
    let { title, content, release_date, userID } = req.body;

    let sql = `update sys_notices set title=?, content=? , release_date=?, userID=? where noticeID=?`
    let sqlArr = [title, content, release_date, userID, noticeID]

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

// 删除指定公告
deleteNotice = (req, res) => {
    let { noticeID } = req.params;
    let sql = `DELETE FROM sys_notices WHERE noticeID=?`
    let sqlArr = [noticeID]
    let callBack = (err, data) => {
        if (err) {
            res.status(500).send({ error: '删除失败' });
        } else {
            res.send({ message: '删除成功' });
        }
    }

    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

// 获取所有公告
getAllNotice = (req, res) => {
    let sql = `select * from sys_notices`
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
    getNotices,
    getNoticeByID,
    insertNotice,
    updateNotice,
    deleteNotice,
    getAllNotice
}