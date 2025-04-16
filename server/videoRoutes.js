/*
 * @Author: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @Date: 2025-04-13 05:11:01
 * @LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
 * @LastEditTime: 2025-04-13 06:17:55
 * @FilePath: \travel\sakai-vue-master\server\videoRoutes.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const router = express.Router();
const db = require('./db');

// 添加获取视频统计数据的API
router.get('/video-stats', (req, res) => {
    console.log('收到视频统计数据请求');
    const query = `
        SELECT
            COUNT(*) as totalVideos,
            COALESCE(SUM(viewCount), 0) as totalViews,
            COALESCE(SUM(likeCount), 0) as totalLikes,
            COALESCE(SUM(commentCount), 0) as totalComments
        FROM video_fdata
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('查询视频统计数据失败:', err);
            return res.status(500).json({ error: '获取数据失败', details: err.message });
        }

        console.log('数据库返回的原始结果:', results);

        // 确保返回的数据格式正确
        const stats = results[0];
        const formattedResults = {
            totalVideos: parseInt(stats.totalVideos) || 0,
            totalViews: parseFloat(stats.totalViews) || 0,
            totalLikes: parseFloat(stats.totalLikes) || 0,
            totalComments: parseFloat(stats.totalComments) || 0
        };

        console.log('API返回的视频统计数据:', formattedResults);
        res.json(formattedResults);
    });
});

// 添加获取视频数据的API
router.get('/video-data', (req, res) => {
    console.log('收到视频数据请求');

    // 设置响应头确保UTF-8编码
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const query = `
        SELECT
            id, title, description, publishedAt, channelTitle, channelId,
            tags, categoryId, viewCount, likeCount, favoriteCount, commentCount, duration
        FROM
            video_fdata
        ORDER BY
            viewCount DESC
        LIMIT 50
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('查询视频数据失败:', err);
            return res.status(500).json({ error: '获取数据失败', details: err.message });
        }

        // 确保返回的数据格式正确
        const formattedResults = results.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            publishedAt: item.publishedAt,
            channelTitle: item.channelTitle,
            channelId: item.channelId,
            tags: item.tags,
            categoryId: parseFloat(item.categoryId) || 0,
            viewCount: parseFloat(item.viewCount) || 0,
            likeCount: parseFloat(item.likeCount) || 0,
            favoriteCount: parseFloat(item.favoriteCount) || 0,
            commentCount: parseFloat(item.commentCount) || 0,
            duration: item.duration
        }));

        console.log('API返回的视频数据数量:', formattedResults.length);
        res.json(formattedResults);
    });
});

// 添加一个简单的测试接口
router.get('/test', (req, res) => {
    res.json({ message: '视频API路由工作正常' });
});

module.exports = router;
