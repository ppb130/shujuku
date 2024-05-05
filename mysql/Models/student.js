const mysql = require("mysql");

const pool = mysql.createPool({
  host: '116.63.107.106',
  user: 'root',
  password: '375201',
  database: 'xuanke',
  connectionLimit: 10
});

// 封装 query 方法
pool.query = function(sql, values) {
  return new Promise((resolve, reject) => {
    // 获取连接
    pool.getConnection(function(err, connection) {
      if (err) {
        reject(err);
        return;
      }

      // 执行查询
      connection.query(sql, values, function(err, results) {
        // 释放连接
        connection.release();
        // 如果出错，将错误传递给 reject
        if (err) {
          reject(err);
          return;
        }
        // 解析结果并将其传递给 resolve
        resolve(results);
      });
    });
  });
}

module.exports = pool;



