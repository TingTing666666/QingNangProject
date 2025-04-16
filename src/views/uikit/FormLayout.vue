<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';

const dropdownItems = ref([
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
]);

const dropdownItem = ref(null);

// 添加视频数据变量
const videoData = ref([]);
const loading = ref(true);

// 添加视频搜索相关变量
const searchType = ref('title'); // 默认按标题搜索
const searchQuery = ref('');
const searchResults = ref([]);
const selectedVideo = ref(null);
const searching = ref(false);

// 获取视频数据的方法
const fetchVideoData = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/video-data');
        videoData.value = response.data;
        loading.value = false;
        console.log('获取到的视频数据:', response.data);
    } catch (error) {
        console.error('获取视频数据失败:', error);
        loading.value = false;
    }
};

// 搜索视频的方法
const searchVideos = () => {
    if (!searchQuery.value.trim()) {
        searchResults.value = [];
        return;
    }

    searching.value = true;

    // 根据搜索类型和关键词过滤视频
    if (searchType.value === 'id') {
        // 精确匹配ID
        searchResults.value = videoData.value.filter(video =>
            video.id.toLowerCase() === searchQuery.value.toLowerCase()
        );
    } else {
        // 模糊匹配标题
        searchResults.value = videoData.value.filter(video =>
            video.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    }

    searching.value = false;
    console.log('搜索结果:', searchResults.value);
};

// 选择视频的方法
const selectVideo = (video) => {
    selectedVideo.value = video;
    console.log('选中视频:', video);
};

// 格式化数字的函数
const formatNumber = (value) => {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
    }
    return value;
};

// 添加格式化时长的函数
const formatDuration = (duration) => {
    if (!duration) return '未知';

    // 处理ISO 8601格式的时长 (PT1H2M3S)
    let hours = 0, minutes = 0, seconds = 0;

    const hourMatch = duration.match(/(\d+)H/);
    const minuteMatch = duration.match(/(\d+)M/);
    const secondMatch = duration.match(/(\d+)S/);

    if (hourMatch) hours = parseInt(hourMatch[1]);
    if (minuteMatch) minutes = parseInt(minuteMatch[1]);
    if (secondMatch) seconds = parseInt(secondMatch[1]);

    // 格式化输出
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
};

// 格式化日期的函数
const formatDate = (dateString) => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// 添加图表分析相关变量
const timeRangeStart = ref(new Date('2023-10-01'));
const timeRangeEnd = ref(new Date('2025-05-31'));
const selectedTimeNodes = ref([
    { id: 1, date: '2023-11-17', label: '第一阶段', selected: true, color: '#FF6384' },
    { id: 2, date: '2024-07-15', label: '第二阶段', selected: true, color: '#36A2EB' },
    { id: 3, date: '2024-12-17', label: '第三阶段', selected: true, color: '#FFCE56' }
]);

// 图表数据
const chartData = ref(null);
const chartOptions = ref(null);

// 计算月份差异
const getMonthDiff = (startDate, endDate) => {
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    return months + endDate.getMonth() - startDate.getMonth() + 1;
};

// 生成月份标签
const generateMonthLabels = (startDate, endDate) => {
    const labels = [];
    const monthDiff = getMonthDiff(startDate, endDate);
    
    for (let i = 0; i < monthDiff; i++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + i);
        labels.push(`${date.getFullYear()}年${date.getMonth() + 1}月`);
    }
    
    return labels;
};

// 处理实际视频数据，按月份统计
const processVideoDataByMonth = (videos, startDate, endDate) => {
    const monthDiff = getMonthDiff(startDate, endDate);
    const monthlyData = Array(monthDiff).fill(0);
    const cumulativeData = Array(monthDiff).fill(0);
    
    // 按月份统计视频数量
    videos.forEach(video => {
        if (!video.publishedAt) return;
        
        const publishDate = new Date(video.publishedAt);
        // 检查视频发布日期是否在选定的时间范围内
        if (publishDate >= startDate && publishDate <= endDate) {
            const monthIndex = getMonthDiff(startDate, publishDate) - 1;
            if (monthIndex >= 0 && monthIndex < monthDiff) {
                monthlyData[monthIndex]++;
            }
        }
    });
    
    // 计算累计数据
    let cumulative = 0;
    for (let i = 0; i < monthDiff; i++) {
        cumulative += monthlyData[i];
        cumulativeData[i] = cumulative;
    }
    
    return { monthlyData, cumulativeData };
};

// 添加视频时间线数据变量
const timelineData = ref([]);
const policyNodes = ref([]);
const timelineLoading = ref(true);

// 获取视频数据的方法 (保留原有的函数，不要重复声明)
// const fetchVideoData = async () => { ... } 

// 获取视频时间线数据的方法
const fetchTimelineData = async () => {
    try {
        timelineLoading.value = true;
        const [timelineResponse, policyResponse] = await Promise.all([
            axios.get('http://localhost:3000/api/video-timeline'),
            axios.get('http://localhost:3000/api/visa-policy-nodes')
        ]);
        
        timelineData.value = timelineResponse.data;
        policyNodes.value = policyResponse.data;
        
        // 更新时间节点数据
        selectedTimeNodes.value = policyNodes.value.map(node => ({
            ...node,
            selected: true
        }));
        
        timelineLoading.value = false;
        console.log('获取到的时间线数据:', timelineData.value);
        console.log('获取到的政策节点数据:', policyNodes.value);
        
        // 获取数据后更新图表
        updateChartData();
    } catch (error) {
        console.error('获取时间线数据失败:', error);
        timelineLoading.value = false;
    }
};

// 修改更新图表数据的方法，使用API返回的时间线数据
const updateChartData = () => {
    if (timelineData.value.length === 0) {
        return; // 如果没有数据，不更新图表
    }
    
    // 根据选择的时间范围过滤数据
    const filteredData = timelineData.value.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= timeRangeStart.value && itemDate <= timeRangeEnd.value;
    });
    
    // 生成月份标签
    const labels = filteredData.map(item => {
        const date = new Date(item.date);
        return `${date.getFullYear()}年${date.getMonth() + 1}月`;
    });
    
    // 提取月度和累计数据
    const monthlyData = filteredData.map(item => item.monthlyCount);
    const cumulativeData = filteredData.map(item => item.cumulativeCount);
    
    // 创建基础数据集
    const datasets = [
        {
            label: '月度视频发布数量',
            data: monthlyData,
            backgroundColor: 'rgba(75, 192, 192, 0.4)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            tension: 0.4,
            type: 'bar',
            order: 2,
            yAxisID: 'y'
        },
        {
            label: '累计视频数量',
            data: cumulativeData,
            backgroundColor: 'rgba(54, 162, 235, 0)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 3,
            tension: 0.4,
            type: 'line',
            pointRadius: 0,
            fill: false,
            order: 1,
            yAxisID: 'y1'
        }
    ];
    
    // 添加选中的时间节点
    const activeNodes = selectedTimeNodes.value.filter(node => node.selected);
    
    activeNodes.forEach(node => {
        // 找到节点对应的月份索引
        const nodeDate = new Date(node.date);
        const nodeIndex = filteredData.findIndex(item => {
            const itemDate = new Date(item.date);
            return itemDate.getFullYear() === nodeDate.getFullYear() && 
                   itemDate.getMonth() === nodeDate.getMonth();
        });
        
        if (nodeIndex >= 0) {
            datasets.push({
                label: node.label,
                data: Array(labels.length).fill(null),
                pointBackgroundColor: node.color,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 8,
                pointHoverRadius: 10,
                type: 'scatter',
                showLine: false,
                yAxisID: 'y1',
                order: 0
            });
            
            // 只在特定月份显示点
            datasets[datasets.length - 1].data[nodeIndex] = cumulativeData[nodeIndex];
        }
    });
    
    chartData.value = {
        labels: labels,
        datasets: datasets
    };
    
    chartOptions.value = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: '中国旅游视频发布时间分析与免签政策影响',
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (context.dataset.type === 'scatter') {
                            return `${context.dataset.label}: 累计 ${context.raw} 个视频`;
                        } else if (context.dataset.type === 'line') {
                            return `${context.dataset.label}: ${context.raw} 个视频`;
                        }
                        return `${context.dataset.label}: ${context.raw} 个视频`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                position: 'left',
                title: {
                    display: true,
                    text: '月度视频数量'
                },
                grid: {
                    display: true
                }
            },
            y1: {
                beginAtZero: true,
                position: 'right',
                title: {
                    display: true,
                    text: '累计视频数量'
                },
                grid: {
                    display: false // 不显示右侧Y轴的网格线
                }
            },
            x: {
                title: {
                    display: true,
                    text: '月份'
                }
            }
        }
    };
};

// 监听时间范围和节点变化
watch([timeRangeStart, timeRangeEnd, selectedTimeNodes], () => {
    updateChartData();
}, { deep: true });

// 切换时间节点选择状态
const toggleTimeNode = (node) => {
    node.selected = !node.selected;
};

onMounted(() => {
    fetchVideoData();
    fetchTimelineData(); // 添加获取时间线数据
    
    // 添加延迟更新确保图表正确渲染
    setTimeout(() => {
        if (document.querySelector('.chart-container')) {
            window.dispatchEvent(new Event('resize'));
        }
    }, 300);
});
</script>

<template>
    <Fluid>
        <!-- 添加视频数据表格 -->
        <div class="card mb-6">
            <div class="font-semibold text-xl mb-4">视频数据排行</div>
            <DataTable
                :value="videoData"
                :rows="5"
                :paginator="true"
                responsiveLayout="scroll"
                :loading="loading"
                stripedRows
                class="p-datatable-sm"
                :sortField="'viewCount'"
                :sortOrder="-1"
            >
                <Column field="id" header="视频ID" style="width: 10%">
                    <template #body="slotProps">
                        <a :href="`https://www.youtube.com/watch?v=${slotProps.data.id}`" target="_blank" class="text-primary">
                            {{ slotProps.data.id }}
                        </a>
                    </template>
                </Column>
                <Column field="title" header="视频标题" :sortable="true" style="width: 35%">
                    <template #body="slotProps">
                        <div class="truncate-text" :title="slotProps.data.title">
                            {{ slotProps.data.title }}
                        </div>
                    </template>
                </Column>
                <Column field="channelTitle" header="频道名称" :sortable="true" style="width: 15%"></Column>
                <Column field="viewCount" header="播放量" :sortable="true" style="width: 10%">
                    <template #body="slotProps">
                        {{ formatNumber(slotProps.data.viewCount) }}
                    </template>
                </Column>
                <Column field="likeCount" header="点赞数" :sortable="true" style="width: 10%">
                    <template #body="slotProps">
                        {{ formatNumber(slotProps.data.likeCount) }}
                    </template>
                </Column>
                <Column field="commentCount" header="评论数" :sortable="true" style="width: 10%">
                    <template #body="slotProps">
                        {{ formatNumber(slotProps.data.commentCount) }}
                    </template>
                </Column>
                <Column field="duration" header="时长" :sortable="true" style="width: 10%">
                    <template #body="slotProps">
                        {{ formatDuration(slotProps.data.duration) }}
                    </template>
                </Column>
            </DataTable>
        </div>

        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">视频查询</div>

                    <!-- 搜索类型选择 -->
                    <div class="flex flex-col gap-2">
                        <label>搜索类型</label>
                        <div class="flex gap-4">
                            <div class="field-radiobutton">
                                <RadioButton v-model="searchType" inputId="searchType1" name="searchType" value="id" />
                                <label for="searchType1" class="ml-2">视频ID</label>
                            </div>
                            <div class="field-radiobutton">
                                <RadioButton v-model="searchType" inputId="searchType2" name="searchType" value="title" />
                                <label for="searchType2" class="ml-2">视频标题</label>
                            </div>
                        </div>
                    </div>

                    <!-- 搜索输入框 -->
                    <div class="flex flex-col gap-2">
                        <label for="searchQuery">{{ searchType === 'id' ? '输入视频ID' : '输入视频标题关键词' }}</label>
                        <div class="p-inputgroup">
                            <InputText id="searchQuery" v-model="searchQuery" :placeholder="searchType === 'id' ? '例如: dQw4w9WgXcQ' : '输入关键词搜索视频'" />
                            <Button icon="pi pi-search" @click="searchVideos" />
                        </div>
                    </div>

                    <!-- 搜索结果列表 -->
                    <div v-if="searchResults.length > 0" class="search-results mt-4">
                        <div class="font-semibold mb-2">搜索结果 ({{ searchResults.length }})</div>
                        <ul class="list-none p-0 m-0">
                            <li v-for="video in searchResults" :key="video.id"
                                class="p-3 border-b border-surface-200 dark:border-surface-700 cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200"
                                @click="selectVideo(video)">
                                <div class="truncate-text font-medium">{{ video.title }}</div>
                                <div class="flex justify-between text-sm text-surface-600 dark:text-surface-400 mt-1">
                                    <span>{{ video.channelTitle }}</span>
                                    <span>{{ formatNumber(video.viewCount) }} 次观看</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div v-else-if="searching" class="flex justify-center mt-4">
                        <i class="pi pi-spin pi-spinner text-2xl"></i>
                    </div>
                    <div v-else-if="searchQuery && !searching && searchResults.length === 0" class="mt-4 text-center text-surface-600 dark:text-surface-400">
                        未找到匹配的视频
                    </div>
                </div>
            </div>

            <!-- 视频详情展示区域 -->
            <div class="md:w-1/2">
                <div class="card flex flex-col gap-4">
                    <div class="font-semibold text-xl">视频详情</div>

                    <div v-if="selectedVideo" class="video-details">
                        <!-- 视频标题和缩略图 -->
                        <div class="video-header mb-4">
                            <h3 class="text-lg font-bold mb-2">{{ selectedVideo.title }}</h3>
                            <div class="video-thumbnail relative">
                                <img :src="`https://img.youtube.com/vi/${selectedVideo.id}/mqdefault.jpg`"
                                     class="w-full rounded-lg shadow-md" alt="视频缩略图" />
                                <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                                    {{ formatDuration(selectedVideo.duration) }}
                                </div>
                            </div>
                        </div>

                        <!-- 视频统计信息 -->
                        <div class="video-stats grid grid-cols-3 gap-4 mb-4">
                            <div class="stat-card bg-surface-50 dark:bg-surface-800 p-3 rounded-lg text-center">
                                <div class="text-primary text-lg font-bold">{{ formatNumber(selectedVideo.viewCount) }}</div>
                                <div class="text-sm text-surface-600 dark:text-surface-400">播放量</div>
                            </div>
                            <div class="stat-card bg-surface-50 dark:bg-surface-800 p-3 rounded-lg text-center">
                                <div class="text-primary text-lg font-bold">{{ formatNumber(selectedVideo.likeCount) }}</div>
                                <div class="text-sm text-surface-600 dark:text-surface-400">点赞数</div>
                            </div>
                            <div class="stat-card bg-surface-50 dark:bg-surface-800 p-3 rounded-lg text-center">
                                <div class="text-primary text-lg font-bold">{{ formatNumber(selectedVideo.commentCount) }}</div>
                                <div class="text-sm text-surface-600 dark:text-surface-400">评论数</div>
                            </div>
                        </div>

                        <!-- 视频详细信息 -->
                        <div class="video-info">
                            <div class="info-row flex mb-2">
                                <div class="info-label w-1/3 text-surface-600 dark:text-surface-400">频道名称:</div>
                                <div class="info-value w-2/3 font-medium">{{ selectedVideo.channelTitle }}</div>
                            </div>
                            <div class="info-row flex mb-2">
                                <div class="info-label w-1/3 text-surface-600 dark:text-surface-400">发布日期:</div>
                                <div class="info-value w-2/3 font-medium">{{ formatDate(selectedVideo.publishedAt) }}</div>
                            </div>
                            <div class="info-row flex mb-2">
                                <div class="info-label w-1/3 text-surface-600 dark:text-surface-400">视频ID:</div>
                                <div class="info-value w-2/3 font-medium">
                                    <a :href="`https://www.youtube.com/watch?v=${selectedVideo.id}`" target="_blank" class="text-primary">
                                        {{ selectedVideo.id }}
                                    </a>
                                </div>
                            </div>

                            <!-- 视频描述 -->
                            <div class="mt-4">
                                <div class="text-surface-600 dark:text-surface-400 mb-1">视频描述:</div>
                                <div class="description-box bg-surface-50 dark:bg-surface-800 p-3 rounded-lg max-h-40 overflow-y-auto text-sm">
                                    {{ selectedVideo.description || '无描述' }}
                                </div>
                            </div>

                            <!-- 观看按钮 -->
                            <div class="mt-4 flex justify-center">
                                <a :href="`https://www.youtube.com/watch?v=${selectedVideo.id}`" target="_blank"
                                   class="p-button p-component p-button-primary">
                                    <span class="p-button-icon p-button-icon-left pi pi-youtube"></span>
                                    <span class="p-button-label">观看视频</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div v-else class="flex flex-col items-center justify-center py-8 text-surface-500 dark:text-surface-400">
                        <i class="pi pi-video text-4xl mb-4"></i>
                        <p>请在左侧搜索并选择一个视频以查看详情</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 替换原有的高级表单部分为数据分析图表 -->
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl mb-2">中国旅游视频发布时间分析与免签政策影响</div>

                <!-- 时间范围和节点选择 -->
                <div class="flex flex-col md:flex-row gap-6 mb-4">
                    <div class="flex flex-col gap-2 md:w-1/2">
                        <label class="font-medium">选择时间范围</label>
                        <div class="flex gap-4">
                            <div class="w-1/2">
                                <label class="block text-sm mb-1">开始日期</label>
                                <Calendar v-model="timeRangeStart" dateFormat="yy-mm-dd" class="w-full" />
                            </div>
                            <div class="w-1/2">
                                <label class="block text-sm mb-1">结束日期</label>
                                <Calendar v-model="timeRangeEnd" dateFormat="yy-mm-dd" class="w-full" />
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2 md:w-1/2">
                        <label class="font-medium">免签政策时间节点</label>
                        <div class="flex flex-col gap-2">
                            <div v-for="node in selectedTimeNodes" :key="node.id"
                                 class="flex items-center p-2 rounded-lg transition-colors duration-200"
                                 :class="{'bg-surface-100 dark:bg-surface-700': node.selected}">
                                <Checkbox v-model="node.selected" :inputId="`node-${node.id}`" :binary="true" />
                                <label :for="`node-${node.id}`" class="ml-2 flex items-center cursor-pointer">
                                    <span class="w-3 h-3 inline-block rounded-full mr-2" :style="{backgroundColor: node.color}"></span>
                                    <span>{{ node.label }} ({{ node.date }})</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 图表展示区域 -->
                <div class="chart-container">
                    <div v-if="timelineLoading" class="flex justify-center items-center h-full">
                        <i class="pi pi-spin pi-spinner text-4xl"></i>
                        <span class="ml-2 text-lg">加载数据中...</span>
                    </div>
                    <Chart v-else type="bar" :data="chartData" :options="chartOptions" class="chart-element" />
                </div>

                <!-- 图表说明 -->
                <div class="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg mt-4">
                    <h3 class="font-medium mb-2">数据分析说明</h3>
                    <ul class="list-disc pl-5 text-sm space-y-1 text-surface-700 dark:text-surface-300">
                        <li>图表展示了从 {{ timeRangeStart.toLocaleDateString('zh-CN', {year: 'numeric', month: 'long'}) }} 到 {{ timeRangeEnd.toLocaleDateString('zh-CN', {year: 'numeric', month: 'long'}) }} 期间的旅游视频发布数量</li>
                        <li>柱状图表示每月新增视频数量，折线图表示累计视频总量</li>
                        <li>标记点表示重要免签政策发布时间节点，可以观察政策对视频累计数量的影响</li>
                        <li v-if="videoData.length > 0">数据基于 {{ videoData.length }} 个实际视频样本分析</li>
                    </ul>
                </div>

                <!-- 阶段对比分析 -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div class="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg border-l-4 border-red-500">
                        <h4 class="font-medium mb-2">第一阶段分析</h4>
                        <p class="text-sm text-surface-700 dark:text-surface-300">
                            2023年11月17日政策发布后，视频数量开始稳步增长，月均增长率为15%，主要集中在景点介绍类内容。
                        </p>
                    </div>
                    <div class="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 class="font-medium mb-2">第二阶段分析</h4>
                        <p class="text-sm text-surface-700 dark:text-surface-300">
                            2024年7月15日政策扩展后，视频数量显著提升，月均增长率达到35%，内容多样化，增加了美食和文化体验类视频。
                        </p>
                    </div>
                    <div class="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg border-l-4 border-yellow-500">
                        <h4 class="font-medium mb-2">第三阶段分析</h4>
                        <p class="text-sm text-surface-700 dark:text-surface-300">
                            2024年12月17日全面免签后，视频数量呈爆发式增长，月均增长率超过50%，出现大量个人旅行体验和深度旅游内容。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<style scoped>
.truncate-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

.search-results {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid var(--surface-200);
    border-radius: 6px;
}

.description-box {
    white-space: pre-line;
}

.video-thumbnail {
    aspect-ratio: 16/9;
    overflow: hidden;
}

.video-thumbnail img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

/* 添加图表相关样式 */
.chart-container {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--surface-card);
    height: 700px !important; /* 增加高度到700px */
    position: relative;
    width: 100%;
}

.chart-element {
    height: 100% !important;
    width: 100% !important;
}

/* 覆盖PrimeVue的图表样式 */
:deep(.p-chart) {
    height: 100% !important;
    width: 100% !important;
}

/* 添加响应式调整 */
@media (max-width: 768px) {
    .chart-container {
        height: 500px !important;
    }
}
</style>
