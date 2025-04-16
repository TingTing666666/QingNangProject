const express = require('express');
const router = express.Router();
const db = require('./db');

// 获取按月份统计的视频发布数据
router.get('/video-timeline', (req, res) => {
    console.log('收到视频时间线数据请求');

    // 设置响应头确保UTF-8编码
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // 查询按月份统计的视频数量
    const query = `
        SELECT
            DATE_FORMAT(publishedAt, '%Y-%m-01') AS month,
            COUNT(*) AS videoCount
        FROM
            video_fdata
        WHERE
            publishedAt IS NOT NULL
        GROUP BY
            DATE_FORMAT(publishedAt, '%Y-%m-01')
        ORDER BY
            month ASC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('查询视频时间线数据失败:', err);
            return res.status(500).json({ error: '获取数据失败', details: err.message });
        }

        // 处理结果，计算累计数量
        let cumulativeCount = 0;
        const timelineData = results.map(item => {
            cumulativeCount += parseInt(item.videoCount);
            return {
                month: item.month,
                date: new Date(item.month).toISOString(),
                monthlyCount: parseInt(item.videoCount),
                cumulativeCount: cumulativeCount
            };
        });

        console.log('API返回的视频时间线数据数量:', timelineData.length);
        res.json(timelineData);
    });
});

// 获取免签政策时间节点数据
router.get('/visa-policy-nodes', (req, res) => {
    console.log('收到免签政策节点数据请求');

    // 预定义的免签政策时间节点
    const policyNodes = [
        {
            id: 1,
            label: '首批试点免签',
            date: '2023-11-17',
            color: '#FF5252',
            selected: true,
            description: '中国宣布对法国、德国、意大利等6个国家试点实施单方面免签政策'
        },
        {
            id: 2,
            label: '扩大免签范围',
            date: '2024-07-15',
            color: '#2196F3',
            selected: true,
            description: '中国将免签政策扩大到瑞士、爱尔兰等11个国家'
        },
        {
            id: 3,
            label: '全面免签实施',
            date: '2024-12-17',
            color: '#FFC107',
            selected: true,
            description: '中国宣布对全球30个主要旅游客源国实施免签政策'
        }
    ];

    res.json(policyNodes);
});

module.exports = router;
