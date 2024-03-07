const dbConfig = require('../util/deConfig')

// 获取所有品牌信息
getCarBrand = (req, res) => {
    let sql = `select DISTINCT brand FROM car`
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

// 获取所有汽车租赁状态信息
getCarIsRent = (req, res) => {
    let sql = `select DISTINCT isRent FROM car`
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

// 获取所有车辆类型信息
getCarType = (req, res) => {
    let sql = `select DISTINCT type FROM car`
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

// 获取所有车辆颜色信息
getCarColor = (req, res) => {
    let sql = `select DISTINCT color FROM car`
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

// 获取指定id的汽车信息
getCarByID = (req, res) => {
    console.log(req.query);
    const { carID } = req.query
    let sql = `select * from car where carID=?`
    let sqlArr = [carID]
    let callBack = (err, data) => {
        if (err) {
            console.log('连接出错了');
        } else {
            res.send({ data })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

// 获取指定汽车的信息
getCars = (req, res) => {
    const page = parseInt(req.query.page, 10) || 1; // 获取页码，默认为1  
    const limit = parseInt(req.query.limit, 10) || 5; // 获取每页数量，默认为5  
    // 计算偏移量，这里假设页码从1开始  
    const offset = (page - 1) * limit;
    if (!req.query.keyword) {
        // 创建一个用于计算总数的SQL查询  
        let totalSql = "SELECT COUNT(*) as total FROM car";

        // 执行总数查询  
        dbConfig.sqlConnect(totalSql, [], (err, totalData) => {
            if (err) {
                console.log('连接出错了');
                res.status(500).send({ error: '查询出错了' });
                return;
            }

            const total = totalData[0].total; // 获取总数  

            // 创建一个用于获取当前页数据的SQL查询  
            let sql = `SELECT * FROM car ORDER BY carID LIMIT ${limit} OFFSET ${offset}`;

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
        req.query.keyword ? req.query.keyword : {}
        let { isRent, type, color, brand } = req.query.keyword;
        isRent = Array.isArray(isRent) ? isRent : [];
        type = Array.isArray(type) ? type : [];
        color = Array.isArray(color) ? color : [];
        brand = Array.isArray(brand) ? brand : [];

        // 创建一个用于计算总数的SQL查询  
        let totalSql = `SELECT COUNT(*) as total FROM car WHERE  
        ${isRent.length > 0 ? `isRent in (${isRent})` : '1=1'}  
        ${type.length > 0 ? `and type in (${type.map(item => `'${item}'`)})` : 'and 1=1'}  
        ${color.length > 0 ? `and color in (${color.map(item => `'${item}'`)})` : 'and 1=1'} 
        ${brand.length > 0 ? `and brand in (${brand.map(item => `'${item}'`)})` : 'and 1=1'}  
    `;

        // 执行总数查询  
        dbConfig.sqlConnect(totalSql, [
            isRent, // isRent数组的每个值作为一个参数  
            type, // type数组  
            color, // color数组  
            brand   // brand数组  
        ], (err, totalData) => {
            if (err) {
                console.log('连接出错了');
                res.status(500).send({ error: '查询出错了' });
                return;
            }

            const total = totalData[0].total; // 获取总数  

            // 创建一个用于获取当前页数据的SQL查询  
            let sql = `SELECT * FROM car WHERE  
            ${isRent.length > 0 ? `isRent in (${isRent})` : '1=1'}  
            ${type.length > 0 ? `and type in (${type.map(item => `'${item}'`)})` : 'and 1=1'}  
            ${color.length > 0 ? `and color in (${color.map(item => `'${item}'`)})` : 'and 1=1'} 
            ${brand.length > 0 ? `and brand in (${brand.map(item => `'${item}'`)})` : 'and 1=1'}  
      ORDER BY carID LIMIT ${limit} OFFSET ${offset}`;

            // 执行当前页数据查询  
            dbConfig.sqlConnect(sql, [
                isRent, // isRent数组的每个值作为一个参数  
                type, // type数组  
                color, // color数组  
                brand   // brand数组  
            ], (err, data) => {
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
};


// 新增汽车信息
insertCar = (req, res) => {
    console.log(req.body);
    let { plateNumber, brand, model, type, color, year, deposit, price, mileage, isRent, notes } = req.body
    let sql = `insert into car (plateNumber, brand, model, type,color, year, deposit, price, mileage, isRent, notes) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    let sqlArr = [plateNumber, brand, model, type, deposit, color, year, price, mileage, isRent, notes]

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

// 更新汽车信息
updateCar = (req, res) => {
    let { carID } = req.params
    let { plateNumber, brand, model, type, color, year, deposit, price, mileage, isRent, notes } = req.body;

    let sql = `update car set plateNumber=?, brand=?, model=?, type=?, color=?, deposit=?, year=?,  price=?, mileage=?, isRent=?, notes=? where carID=?`
    let sqlArr = [plateNumber, brand, model, type, color, deposit, year, price, mileage, isRent, notes, carID]

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

// 删除指定汽车
deleteCar = (req, res) => {
    let { carID } = req.params;
    let sql = `DELETE FROM car WHERE carID=?`
    let sqlArr = [carID]
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

// // 获取指定id的汽车信息
getTypeTotal = (req, res) => {
    const { } = req.query
    let sql = `SELECT type,COUNT(type) AS total_types FROM car GROUP BY type;`
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
    getCars,
    getCarBrand,
    getCarIsRent,
    getCarType,
    getCarColor,
    getCarByID,
    // getCarByQuery,
    insertCar,
    updateCar,
    deleteCar,
    getTypeTotal
}

/**

meiwenti 没问题啊
{ page: '1', pagesize: '5', keyword: { color: [ '白色' ] } }

wokankan 你返回值
*/