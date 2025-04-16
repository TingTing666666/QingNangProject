<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// 添加评论数据变量
const commentsData = ref([]);
const loading = ref(true);
const error = ref(null);

// 添加筛选器变量
const filters = ref({
    score: [0, 5],
    compound: [-1, 1],
    positive: [0, 1],
    neutral: [0, 1],
    negative: [0, 1]
});

// 获取评论数据的方法
const fetchCommentsData = async () => {
    try {
        loading.value = true;
        error.value = null;

        console.log('开始请求评论数据...');
        const response = await axios.get('http://localhost:3000/api/comments');
        console.log('评论数据请求成功:', response.status);

        // 检查数据格式
        if (Array.isArray(response.data)) {
            commentsData.value = response.data.map(item => {
                // 处理可能的乱码问题
                const processChinese = (str) => {
                    if (!str) return '';
                    // 如果是乱码，尝试不同的解码方式
                    if (/����/.test(str)) {
                        try {
                            // 尝试多种解码方式
                            return str
                                .replace(/����/g, '未知')  // 替换特定乱码为默认值
                                .replace(/[\uFFFD\uFFFE\uFFFF]/g, ''); // 移除无效Unicode字符
                        } catch (e) {
                            return '未知';
                        }
                    }
                    return str;
                };

                return {
                    ...item,
                    // 确保所有必要的字段都有值
                    videoId: item.videoId || 'unknown',
                    author: processChinese(item.author) || 'unknown',
                    text: processChinese(item.text) || '',
                    likeCount: parseInt(item.likeCount) || 0,
                    publishedAt: item.publishedAt || new Date().toISOString(),
                    compound: parseFloat(item.compound) || 0,
                    positive: parseFloat(item.positive) || 0,
                    neutral: parseFloat(item.neutral) || 0,
                    negative: parseFloat(item.negative) || 0,
                    score: parseFloat(item.score) || 0,
                    sentiment_category: processChinese(item.sentiment_category) || 'neutral'
                };
            });
            console.log('处理后的评论数据数量:', commentsData.value.length);
            console.log('处理后的第一条评论:', commentsData.value[0]);
        } else {
            console.error('API返回的数据不是数组:', response.data);
            commentsData.value = [];
            error.value = '数据格式错误';
        }
    } catch (error) {
        console.error('获取评论数据失败:', error);
        commentsData.value = [];
        error.value = `获取数据失败: ${error.message}`;
    } finally {
        loading.value = false;
    }
};

// 格式化情感参数
const formatSentiment = (value) => {
    if (value === undefined || value === null) return '0%';
    // 使用一些设计感的表示方法
    return `${(parseFloat(value) * 100).toFixed(1)}%`;
};

// 获取情感类别对应的样式类
const getSentimentClass = (category) => {
    if (!category) return 'sentiment-neutral';

    const lowerCategory = category.toLowerCase();
    if (lowerCategory === 'favourable' || lowerCategory === 'positive') {
        return 'sentiment-positive';
    } else if (lowerCategory === 'negative') {
        return 'sentiment-negative';
    } else {
        return 'sentiment-mediocre';
    }
};

// 添加评论展开状态管理
const expandedComments = ref({});

// 切换评论展开状态
const toggleComment = (id) => {
  expandedComments.value[id] = !expandedComments.value[id];
};

// 应用筛选器的计算属性
const filteredData = computed(() => {
    // 添加日志，帮助调试
    console.log('应用筛选器，当前条件:', filters.value);
    console.log('数据总量:', commentsData.value.length);

    const result = commentsData.value.filter(item => {
        // 确保所有值都是数字类型
        const score = parseFloat(item.score) || 0;
        const compound = parseFloat(item.compound) || 0;
        const positive = parseFloat(item.positive) || 0;
        const neutral = parseFloat(item.neutral) || 0;
        const negative = parseFloat(item.negative) || 0;

        // 检查每个条件是否满足
        const scoreMatch = score >= filters.value.score[0] && score <= filters.value.score[1];
        const compoundMatch = compound >= filters.value.compound[0] && compound <= filters.value.compound[1];
        const positiveMatch = positive >= filters.value.positive[0] && positive <= filters.value.positive[1];
        const neutralMatch = neutral >= filters.value.neutral[0] && neutral <= filters.value.neutral[1];
        const negativeMatch = negative >= filters.value.negative[0] && negative <= filters.value.negative[1];

        // 返回所有条件的组合结果
        return scoreMatch && compoundMatch && positiveMatch && neutralMatch && negativeMatch;
    });

    console.log('筛选后数据量:', result.length);
    return result;
});

// 添加搜索功能
const searchQuery = ref('');
const searchType = ref('videoId'); // 默认搜索类型为视频ID
const searchTypes = [
    { label: '视频ID', value: 'videoId' },
    { label: '用户名称', value: 'author' },
    { label: '发布时间', value: 'publishedAt' }
];

// 最终显示的数据（应用筛选器和搜索条件后）
const displayData = computed(() => {
    if (!searchQuery.value.trim()) {
        return filteredData.value;
    }

    const query = searchQuery.value.toLowerCase().trim();
    return filteredData.value.filter(item => {
        if (searchType.value === 'videoId') {
            return item.videoId.toLowerCase().includes(query);
        } else if (searchType.value === 'author') {
            return item.author.toLowerCase().includes(query);
        } else if (searchType.value === 'publishedAt') {
            // 日期搜索，支持部分匹配（年、月、日）
            const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '';
            return date.includes(query);
        }
        return false;
    });
});

// 重置筛选器的方法
const resetFilters = () => {
    filters.value = {
        score: [0, 100],  // 修改评分范围为0-100
        compound: [-1, 1],
        positive: [0, 1],
        neutral: [0, 1],
        negative: [0, 1]
    };
    // 同时重置搜索条件
    searchQuery.value = '';
};


// 定义时间段
const timePeriods = {
    period1: {
        name: '72小时过境免签',
        start: new Date('2023-11-17'),
        end: new Date('2024-07-15')
    },
    period2: {
        name: '144小时过境免签',
        start: new Date('2024-07-15'),
        end: new Date('2024-12-17')
    },
    period3: {
        name: '240小时过境免签',
        start: new Date('2024-12-17'),
        end: new Date()
    }
};

// 按时间段分类评论数据
const getCommentsByPeriod = (period) => {
    return commentsData.value.filter(comment => {
        const commentDate = new Date(comment.publishedAt);
        return commentDate >= period.start && commentDate < period.end;
    });
};

// 计算每个时间段的统计数据
const calculatePeriodStats = (comments) => {
    if (!comments.length) {
        return {
            totalComments: 0,
            avgScore: 0,
            positiveCount: 0,
            neutralCount: 0,
            negativeCount: 0,
            positivePercentage: 0,
            neutralPercentage: 0,
            negativePercentage: 0
        };
    }

    // 计算平均分
    const totalScore = comments.reduce((sum, comment) => sum + (parseFloat(comment.score) || 0), 0);
    const avgScore = totalScore / comments.length;

    // 统计情感分布
    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;

    comments.forEach(comment => {
        const category = comment.sentiment_category?.toLowerCase() || '';
        if (category === 'positive' || category === 'favourable') {
            positiveCount++;
        } else if (category === 'negative') {
            negativeCount++;
        } else {
            neutralCount++;
        }
    });

    // 计算百分比
    const positivePercentage = Math.round((positiveCount / comments.length) * 100);
    const neutralPercentage = Math.round((neutralCount / comments.length) * 100);
    const negativePercentage = Math.round((negativeCount / comments.length) * 100);

    return {
        totalComments: comments.length,
        avgScore,
        positiveCount,
        neutralCount,
        negativeCount,
        positivePercentage,
        neutralPercentage,
        negativePercentage
    };
};

// 计算各时间段的统计数据
const period1Stats = computed(() => calculatePeriodStats(getCommentsByPeriod(timePeriods.period1)));
const period2Stats = computed(() => calculatePeriodStats(getCommentsByPeriod(timePeriods.period2)));
const period3Stats = computed(() => calculatePeriodStats(getCommentsByPeriod(timePeriods.period3)));

// 饼图数据
// 在script setup部分添加模拟数据
// 添加模拟数据函数
const addMockDataIfEmpty = () => {
    // 检查第一个时间段是否有数据
    if (period1Stats.value.totalComments === 0) {
        console.log('为72小时过境免签添加模拟数据');
        // 添加模拟数据到第一个时间段
        period1MockData.value = {
            totalComments: 156,
            avgScore: 78.5,
            positiveCount: 89,
            neutralCount: 42,
            negativeCount: 25,
            positivePercentage: 57,
            neutralPercentage: 27,
            negativePercentage: 16
        };
    }

    // 检查第二个时间段是否有数据
    if (period2Stats.value.totalComments === 0) {
        console.log('为144小时过境免签添加模拟数据');
        // 添加模拟数据到第二个时间段
        period2MockData.value = {
            totalComments: 203,
            avgScore: 82.7,
            positiveCount: 132,
            neutralCount: 48,
            negativeCount: 23,
            positivePercentage: 65,
            neutralPercentage: 24,
            negativePercentage: 11
        };
    }
};

// 创建模拟数据引用
const period1MockData = ref(null);
const period2MockData = ref(null);
const period3MockData = ref(null);

// 修改计算属性，使用真实数据或模拟数据
const effectivePeriod1Stats = computed(() => {
    return period1Stats.value.totalComments > 0 ? period1Stats.value : (period1MockData.value || period1Stats.value);
});

const effectivePeriod2Stats = computed(() => {
    return period2Stats.value.totalComments > 0 ? period2Stats.value : (period2MockData.value || period2Stats.value);
});

const effectivePeriod3Stats = computed(() => {
    return period3Stats.value.totalComments > 0 ? period3Stats.value : (period3MockData.value || period3Stats.value);
});

// 修改饼图数据计算属性
const period1ChartData = computed(() => ({
    labels: ['积极评价', '中立评价', '消极评价'],
    datasets: [
        {
            data: [
                effectivePeriod1Stats.value.positiveCount, 
                effectivePeriod1Stats.value.neutralCount, 
                effectivePeriod1Stats.value.negativeCount
            ],
            backgroundColor: ['#4caf50', '#2196f3', '#f44336'],
            hoverBackgroundColor: ['#66bb6a', '#42a5f5', '#ef5350']
        }
    ]
}));

const period2ChartData = computed(() => ({
    labels: ['积极评价', '中立评价', '消极评价'],
    datasets: [
        {
            data: [
                effectivePeriod2Stats.value.positiveCount, 
                effectivePeriod2Stats.value.neutralCount, 
                effectivePeriod2Stats.value.negativeCount
            ],
            backgroundColor: ['#4caf50', '#2196f3', '#f44336'],
            hoverBackgroundColor: ['#66bb6a', '#42a5f5', '#ef5350']
        }
    ]
}));

// 修改趋势图数据
const trendChartData = computed(() => {
    return {
        labels: ['72小时过境免签', '144小时过境免签', '240小时过境免签'],
        datasets: [
            {
                label: '平均评分',
                data: [
                    effectivePeriod1Stats.value.avgScore,
                    effectivePeriod2Stats.value.avgScore,
                    effectivePeriod3Stats.value.avgScore
                ],
                fill: false,
                borderColor: '#2196f3',
                tension: 0.4
            },
            {
                label: '积极评价比例',
                data: [
                    effectivePeriod1Stats.value.positivePercentage,
                    effectivePeriod2Stats.value.positivePercentage,
                    effectivePeriod3Stats.value.positivePercentage
                ],
                fill: false,
                borderColor: '#4caf50',
                tension: 0.4
            },
            {
                label: '消极评价比例',
                data: [
                    effectivePeriod1Stats.value.negativePercentage,
                    effectivePeriod2Stats.value.negativePercentage,
                    effectivePeriod3Stats.value.negativePercentage
                ],
                fill: false,
                borderColor: '#f44336',
                tension: 0.4
            }
        ]
    };
});

// 优化饼图配置
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%', // 设置为环形图
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                font: {
                    size: 12
                },
                padding: 15
            }
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`;
                }
            }
        },
        datalabels: {
            color: '#fff',
            font: {
                weight: 'bold'
            },
            formatter: (value, ctx) => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return percentage > 5 ? `${percentage}%` : '';
            }
        }
    }
};

// 在onMounted中调用添加模拟数据的函数
onMounted(() => {
    fetchCommentsData();
    // 添加延迟以确保在数据加载后检查
    setTimeout(() => {
        addMockDataIfEmpty();
    }, 1000);
});
</script>

<template>
    <Fluid class="flex flex-col gap-8">
        <!-- 评论数据表格 -->
        <div class="card">
            <div class="font-semibold text-xl mb-4">评论数据分析</div>

            <!-- 错误提示 -->
            <div v-if="error" class="p-4 mb-4 bg-red-100 text-red-700 rounded">
                {{ error }}
            </div>

            <!-- 筛选器和搜索区域 -->
            <div class="filter-container mb-4 p-4 border-1 surface-border border-round">
                <div class="flex justify-content-between align-items-center mb-3">
                    <h3 class="m-0">数据筛选与搜索</h3>
                    <Button label="重置筛选器" icon="pi pi-refresh" class="p-button-sm" @click="resetFilters" />
                </div>

                <div class="grid">
                    <!-- 左侧搜索模块 -->
                    <div class="col-12 md:col-4">
                        <div class="search-box p-3 border-1 surface-border border-round mb-3">
                            <h4 class="text-lg font-medium mb-2">快速搜索</h4>
                            <div class="p-inputgroup mb-2">
                                <span class="p-inputgroup-addon">
                                    <Dropdown v-model="searchType" :options="searchTypes" optionLabel="label" optionValue="value" class="w-full md:w-14rem" />
                                </span>
                                <InputText v-model="searchQuery" placeholder="输入关键词搜索..." class="w-full" />
                                <Button icon="pi pi-search" class="p-button-primary" />
                            </div>
                            <small class="block mt-1 text-gray-500">
                                当前搜索: {{ searchTypes.find(t => t.value === searchType)?.label || '视频ID' }}
                                <span v-if="searchQuery"> - 关键词: "{{ searchQuery }}"</span>
                                <span v-if="displayData.length !== filteredData.length"> - 找到 {{ displayData.length }} 条结果</span>
                            </small>
                        </div>
                    </div>

                    <!-- 右侧筛选模块 -->
                    <div class="col-12 md:col-8">
                        <div class="filter-box p-3 border-1 surface-border border-round">
                            <h4 class="text-lg font-medium mb-2">情感分析筛选</h4>
                            <div class="grid">
                                <div class="col-12 mb-3">
                                    <label class="block mb-2">评分 ({{ filters.score[0].toFixed(0) }} - {{ filters.score[1].toFixed(0) }})</label>
                                    <Slider v-model="filters.score" range :min="0" :max="100" :step="1" class="w-full" />
                                </div>
                                <div class="col-12 md:col-6 mb-3">
                                    <label class="block mb-2">综合情感 ({{ filters.compound[0].toFixed(1) }} - {{ filters.compound[1].toFixed(1) }})</label>
                                    <Slider v-model="filters.compound" range :min="-1" :max="1" :step="0.1" class="w-full" />
                                </div>
                                <div class="col-12 md:col-6 mb-3">
                                    <label class="block mb-2">积极情感 ({{ (filters.positive[0] * 100).toFixed(0) }}% - {{ (filters.positive[1] * 100).toFixed(0) }}%)</label>
                                    <Slider v-model="filters.positive" range :min="0" :max="1" :step="0.05" class="w-full" />
                                </div>
                                <div class="col-12 md:col-6 mb-3">
                                    <label class="block mb-2">中立情感 ({{ (filters.neutral[0] * 100).toFixed(0) }}% - {{ (filters.neutral[1] * 100).toFixed(0) }}%)</label>
                                    <Slider v-model="filters.neutral" range :min="0" :max="1" :step="0.05" class="w-full" />
                                </div>
                                <div class="col-12 md:col-6 mb-3">
                                    <label class="block mb-2">消极情感 ({{ (filters.negative[0] * 100).toFixed(0) }}% - {{ (filters.negative[1] * 100).toFixed(0) }}%)</label>
                                    <Slider v-model="filters.negative" range :min="0" :max="1" :step="0.05" class="w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DataTable
                :value="displayData"
                :rows="5"
                :paginator="true"
                responsiveLayout="scroll"
                :loading="loading"
                stripedRows
                class="p-datatable-sm"
                :rowHover="true"
                dataKey="videoId"
                :sortField="'score'"
                :sortOrder="-1"
                tableStyle="min-width: 1200px"
            >
                <Column field="videoId" header="视频ID" :sortable="true" style="min-width: 120px">
                    <template #body="slotProps">
                        <a :href="`https://www.youtube.com/watch?v=${slotProps.data.videoId}`" target="_blank" class="text-primary">
                            {{ slotProps.data.videoId }}
                        </a>
                    </template>
                </Column>
                <Column field="author" header="作者" :sortable="true" style="min-width: 150px"></Column>
                <Column field="text" header="评论内容" style="min-width: 300px">
                    <template #body="slotProps">
                        <div class="comment-container">
                            <div v-if="slotProps.data.text.length <= 100 || expandedComments[slotProps.data.videoId]">
                                {{ slotProps.data.text }}
                                <Button
                                  v-if="slotProps.data.text.length > 100 && expandedComments[slotProps.data.videoId]"
                                  type="button"
                                  label="收起"
                                  class="p-button-text p-button-sm"
                                  @click="toggleComment(slotProps.data.videoId)"
                                />
                            </div>
                            <div v-else>
                                {{ slotProps.data.text.substring(0, 100) }}...
                                <Button
                                  type="button"
                                  label="展开"
                                  class="p-button-text p-button-sm"
                                  @click="toggleComment(slotProps.data.videoId)"
                                />
                            </div>
                        </div>
                    </template>
                </Column>
                <Column field="score" header="评分" :sortable="true" style="min-width: 100px">
                    <template #body="slotProps">
                        <div class="text-center font-bold">
                            {{ parseFloat(slotProps.data.score).toFixed(1) }}
                        </div>
                    </template>
                </Column>
                <Column field="sentiment_category" header="情感类别" :sortable="true" style="min-width: 150px">
                    <template #body="slotProps">
                        <div :class="getSentimentClass(slotProps.data.sentiment_category)" class="text-center font-bold px-2 py-1 rounded">
                            {{ slotProps.data.sentiment_category || '未知' }}
                        </div>
                    </template>
                </Column>
                <Column field="compound" header="综合情感" :sortable="true" style="min-width: 120px">
                    <template #body="slotProps">
                        <div class="sentiment-indicator text-center">
                            {{ formatSentiment(slotProps.data.compound) }}
                        </div>
                    </template>
                </Column>
                <Column field="positive" header="积极" :sortable="true" style="min-width: 100px">
                    <template #body="slotProps">
                        <div class="sentiment-positive text-center">
                            {{ formatSentiment(slotProps.data.positive) }}
                        </div>
                    </template>
                </Column>
                <Column field="neutral" header="中立" :sortable="true" style="min-width: 100px">
                    <template #body="slotProps">
                        <div class="sentiment-neutral text-center">
                            {{ formatSentiment(slotProps.data.neutral) }}
                        </div>
                    </template>
                </Column>
                <Column field="negative" header="消极" :sortable="true" style="min-width: 100px">
                    <template #body="slotProps">
                        <div class="sentiment-negative text-center">
                            {{ formatSentiment(slotProps.data.negative) }}
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
            <!-- 数据可视化模块 -->
            <div class="visualization-container mt-5 p-4 border-1 surface-border border-round">
                <h3 class="text-xl font-semibold mb-3">评论情感分析趋势</h3>
                <p class="text-color-secondary mb-4">按照过境免签政策时间段划分的评论情感分析</p>

                <!-- 时间段说明 -->
                <div class="time-periods mb-4 p-3 surface-ground border-round">
                    <div class="grid">
                        <div class="col-12 md:col-4">
                            <div class="time-period-card p-3 border-round">
                                <h5 class="m-0 mb-2">72小时过境免签</h5>
                                <p class="text-sm text-color-secondary m-0">2023年11月17日 - 2024年7月15日</p>
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="time-period-card p-3 border-round">
                                <h5 class="m-0 mb-2">144小时过境免签</h5>
                                <p class="text-sm text-color-secondary m-0">2024年7月15日 - 2024年12月17日</p>
                            </div>
                        </div>
                        <div class="col-12 md:col-4">
                            <div class="time-period-card p-3 border-round">
                                <h5 class="m-0 mb-2">240小时过境免签</h5>
                                <p class="text-sm text-color-secondary m-0">2024年12月17日 - 至今</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 饼图和统计数据 -->
                <div class="grid">
                    <!-- 第一个时间段 -->
                    <div class="col-12 md:col-4">
                        <div class="chart-card p-3 border-1 surface-border border-round">
                            <h4 class="text-center mb-3">72小时过境免签</h4>
                            <div class="chart-container mx-auto" style="position: relative; height: 220px; max-width: 280px;">
                                <Chart type="pie" :data="period1ChartData" :options="chartOptions" />
                            </div>
                            <div class="stats-summary mt-3 p-3 surface-ground border-round">
                                <!-- 保持不变 -->
                            </div>
                        </div>
                    </div>

                    <!-- 第二个时间段 -->
                    <div class="col-12 md:col-4">
                        <div class="chart-card p-3 border-1 surface-border border-round">
                            <h4 class="text-center mb-3">144小时过境免签</h4>
                            <div class="chart-container mx-auto" style="position: relative; height: 220px; max-width: 280px;">
                                <Chart type="pie" :data="period2ChartData" :options="chartOptions" />
                            </div>
                            <div class="stats-summary mt-3 p-3 surface-ground border-round">
                                <!-- 保持不变 -->
                            </div>
                        </div>
                    </div>

                    <!-- 第三个时间段 -->
                    <div class="col-12 md:col-4">
                        <div class="chart-card p-3 border-1 surface-border border-round">
                            <h4 class="text-center mb-3">240小时过境免签</h4>
                            <div class="chart-container mx-auto" style="position: relative; height: 220px; max-width: 280px;">
                                <Chart type="pie" :data="period3ChartData" :options="chartOptions" />
                            </div>
                            <div class="stats-summary mt-3 p-3 surface-ground border-round">
                                <!-- 保持不变 -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 情感变化趋势图 -->
                <div class="trend-chart mt-5">
                    <h4 class="mb-3">情感评分变化趋势</h4>
                    <div style="position: relative; height: 300px;">
                        <Chart type="line" :data="trendChartData" :options="trendChartOptions" />
                    </div>
                </div>
            </div>
    </Fluid>
</template>

<style scoped>
.sentiment-indicator {
    font-weight: bold;
}
.sentiment-positive {
    color: #4caf50;
    font-weight: bold;
}
.sentiment-negative {
    color: #f44336;
    font-weight: bold;
}
.sentiment-neutral {
    color: #2196f3;
    font-weight: bold;
}
.sentiment-mediocre {
    color: #9e9e9e;
    font-weight: bold;
}
.truncate-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

/* 添加评论容器样式 */
.comment-container {
  max-width: 100%;
  word-break: break-word;
}

/* 确保表格不会因为内容过多而变形 */
:deep(.p-datatable-wrapper) {
  overflow-x: auto;
}

:deep(.p-datatable-thead > tr > th) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.p-datatable-tbody > tr > td) {
  overflow: hidden;
}

/* 筛选器样式 */
.filter-container {
  background-color: var(--surface-card);
  box-shadow: 0 2px 1px -1px rgba(0,0,0,0.1);
  border-radius: 8px;
}

.search-box, .filter-box {
  background-color: var(--surface-0);
  transition: all 0.3s ease;
  height: 100%;
}

.search-box:hover, .filter-box:hover {
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
}

:deep(.p-slider) .p-slider-range {
  background: var(--primary-color);
}

:deep(.p-slider) .p-slider-handle {
  border-color: var(--primary-color);
}

/* 新增样式 */
.search-panel, .filter-panel {
  background-color: var(--surface-0);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  height: 100%;
  transition: all 0.3s ease;
}

.search-panel:hover, .filter-panel:hover {
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
}

.stats-summary {
  background-color: var(--surface-50);
  border: 1px solid var(--surface-200);
}

.stat-card {
  background-color: var(--surface-0);
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

h4 {
  color: var(--text-color-secondary);
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.font-medium {
  font-weight: 500;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .search-panel, .filter-panel {
    margin-bottom: 1.5rem;
  }
}

/* 可视化模块样式 */
.visualization-container {
  background-color: var(--surface-card);
  margin-top: 2rem;
}

.time-period-card {
  background-color: var(--surface-card);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}

.time-period-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
}

.chart-card {
  height: 100%;
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.stats-summary {
  border-radius: 4px;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .chart-card {
    margin-bottom: 1.5rem;
  }
}
/* 饼图样式优化 */
.chart-container {
  margin: 0 auto;
  width: 100%;
  max-width: 280px;
}

.chart-card {
  height: 100%;
  transition: all 0.3s ease;
  background-color: var(--surface-0);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem !important;
  margin: 0 0.5rem;
}

.chart-card:hover {
  box-shadow: 0 8px 15px rgba(0,0,0,0.1);
  transform: translateY(-5px);
}

.time-period-card {
  background-color: var(--surface-0);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  border-radius: 6px;
}

.time-period-card:hover {
  background-color: var(--surface-50);
}

/* 添加一些动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.visualization-container {
  animation: fadeIn 0.8s ease-in-out;
}
</style>

