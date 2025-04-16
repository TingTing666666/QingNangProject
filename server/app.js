/*
 * @Date: 2024-10-30 22:31:26
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-04-13 06:23:31
 * @FilePath: \sakai-vue-master\sakai-vue-master\server\app.js
 */
const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const PORT = 3000;

// 导入视频路由
const videoRoutes = require('./videoRoutes');
const videoTimelineRoutes = require('./videoTimelineRoutes');
const commentRoutes = require('./commentRoutes');
app.use(cors());
app.use(express.json());

// 使用视频路由
app.use('/api', videoRoutes);
app.use('/api', videoTimelineRoutes);
app.use('/api', commentRoutes); // 注册评论路由

// 获取省份提及数据的API
app.get('/api/province-mentions', (req, res) => {
    const query = 'SELECT province, mentions FROM province_mentions ORDER BY mentions DESC';

    db.query(query, (err, results) => {
        if (err) {
            console.error('查询省份数据失败:', err);
            return res.status(500).json({ error: '获取数据失败', details: err.message });
        }

        // 确保返回的数据格式正确
        const formattedResults = results.map(item => ({
            province: item.province,
            mentions: parseInt(item.mentions)
        }));

        console.log('API返回的数据:', formattedResults);
        res.json(formattedResults);
    });
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
