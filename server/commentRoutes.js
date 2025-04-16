const express = require('express');
const router = express.Router();
const db = require('./db');

// 获取评论数据的API
router.get('/comments', (req, res) => {
    console.log('收到评论数据请求');
    
    // 设置响应头，确保正确的字符编码
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const query = `
        SELECT
            videoId, author, text, likeCount, publishedAt,
            compound, positive, neutral, negative, score, sentiment_category
        FROM
            analyzed_comments
        ORDER BY
            publishedAt DESC
        LIMIT 50
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('查询评论数据失败:', err);
            return res.status(500).json({ error: '获取数据失败', details: err.message });
        }

        // 格式化返回的数据
        const formattedResults = results.map(item => {
            // 确保所有字符串字段都是有效的UTF-8字符串
            const formatString = (str) => {
                if (!str) return '';
                // 如果已经是有效的UTF-8字符串，则直接返回
                try {
                    return str.toString('utf8');
                } catch (e) {
                    return str;
                }
            };
            
            return {
                videoId: item.videoId,
                author: formatString(item.author),
                text: formatString(item.text),
                likeCount: parseInt(item.likeCount) || 0,
                publishedAt: item.publishedAt,
                compound: parseFloat(item.compound) || 0,
                positive: parseFloat(item.positive) || 0,
                neutral: parseFloat(item.neutral) || 0,
                negative: parseFloat(item.negative) || 0,
                score: parseFloat(item.score) || 0,
                sentiment_category: formatString(item.sentiment_category)
            };
        });

        console.log('API返回的评论数据数量:', formattedResults.length);
        // 输出第一条数据的情感类别，用于调试
        if (formattedResults.length > 0) {
            console.log('第一条数据的情感类别:', formattedResults[0].sentiment_category);
        }
        
        res.json(formattedResults);
    });
});

module.exports = router;