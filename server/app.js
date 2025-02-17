/*
 * @Date: 2024-10-30 22:28:09
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2024-10-31 13:30:45
 * @FilePath: \sakai-vue-master\sakai-vue-master\server\app.js
 */

const express = require('express');
const cors = require('cors');
const connection = require('./db');

const app = express();
const PORT = 3000;

// 启用CORS以允许前端访问
app.use(cors());

app.get('/chart-data01', (req, res) => {
    const query = 'SELECT label, Q1, Q2, Q3, Q4 FROM chart_data01';

    connection.query(query, (err, results) => {
        if (err) throw err;

        const data = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: results.map(row => ({
                label: row.label,
                data: [row.Q1, row.Q2, row.Q3, row.Q4]
            }))
        };

        res.json(data);
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
