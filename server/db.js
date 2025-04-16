/*
 * @Date: 2024-10-30 22:31:26
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-04-12 20:47:53
 * @FilePath: \sakai-vue-master\sakai-vue-master\server\db.js
 */
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'mysql_travel',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

module.exports = connection;
