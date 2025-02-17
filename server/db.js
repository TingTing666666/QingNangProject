/*
 * @Date: 2024-10-30 22:31:26
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2024-10-30 22:37:08
 * @FilePath: \sakai-vue-master\sakai-vue-master\server\db.js
 */
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456', // 使用实际的密码
    database: 'mysql_data01'    // 指定你实际的数据存储数据库
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = connection;
