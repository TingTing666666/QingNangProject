<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';

// 接收从父组件传递的数据
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
});

const chartContainer = ref(null);
const chartInstance = ref(null);

onMounted(() => {
    initChart();

    // 直接从API获取数据
    fetchData();
});

// 监听数据变化，更新图表
watch(() => props.data, (newData) => {
    if (newData && newData.length > 0) {
        updateChart(newData);
    }
}, { deep: true });

const initChart = () => {
    if (chartContainer.value) {
        chartInstance.value = echarts.init(chartContainer.value);

        // 设置基本配置
        const option = {
            title: {
                text: '省份提及次数统计',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: [],
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: {
                type: 'value',
                name: '提及次数'
            },
            series: [
                {
                    name: '提及次数',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        color: function(params) {
                            // 为不同省份设置不同颜色
                            const colorList = [
                                '#c23531', '#2f4554', '#61a0a8', '#d48265',
                                '#91c7ae', '#749f83', '#ca8622', '#bda29a',
                                '#6e7074', '#546570', '#c4ccd3'
                            ];
                            return colorList[params.dataIndex % colorList.length];
                        }
                    }
                }
            ]
        };

        chartInstance.value.setOption(option);
    }
};

// 在 updateChart 函数中修改配置
const updateChart = (data) => {
    if (chartInstance.value) {
        // 排序数据
        const sortedData = [...data].sort((a, b) => b.mentions - a.mentions);

        // 提取省份名称和提及次数
        const provinces = sortedData.map(item => item.province);
        const mentions = sortedData.map(item => item.mentions);

        // 设置图表选项
        chartInstance.value.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: '{b}: {c}次'
            },
            xAxis: {
                type: 'category',
                data: provinces,
                axisLabel: {
                    interval: 0,
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                name: '提及次数'
            },
            series: [
                {
                    name: '提及次数',
                    type: 'bar',
                    data: mentions,
                    itemStyle: {
                        color: function(params) {
                            // 为不同省份设置不同颜色
                            const colorList = [
                                '#5470c6', '#91cc75', '#fac858', '#ee6666',
                                '#73c0de', '#3ba272', '#fc8452', '#9a60b4',
                                '#ea7ccc', '#6173e3', '#a78c5a', '#d95050'
                            ];
                            return colorList[params.dataIndex % colorList.length];
                        }
                    },
                    // 添加标签配置
                    label: {
                        show: false,
                        position: 'top',
                        formatter: '{c}'
                    },
                    // 添加鼠标悬停效果
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        label: {
                            show: true
                        }
                    }
                }
            ]
        });
    }
};

const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/province-mentions');
        if (response.data && response.data.length > 0) {
            updateChart(response.data);
        }
    } catch (error) {
        console.error('获取省份提及数据失败:', error);
    }
};

// 窗口大小变化时调整图表大小
window.addEventListener('resize', () => {
    if (chartInstance.value) {
        chartInstance.value.resize();
    }
});
</script>

<template>
    <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
</template>
