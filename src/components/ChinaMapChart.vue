<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import * as echarts from 'echarts';
// 引入中国地图数据
import chinaJson from '@/components/cn.json';
// 引入布局组件以获取主题色
import { useLayout } from '@/layout/composables/layout';

// 获取主题相关信息
const { layoutConfig } = useLayout();

// 计算主题色
const primaryColor = computed(() => {
    return getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
});

// 注册中国地图
echarts.registerMap('china', chinaJson);

// 接收从父组件传递的数据
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
});

const mapContainer = ref(null);
const mapInstance = ref(null);

onMounted(() => {
    initMap();
    fetchData();
});

// 监听数据变化，更新地图
watch(() => props.data, (newData) => {
    if (newData && newData.length > 0) {
        updateMap(newData);
    }
}, { deep: true });

// 监听主题色变化
watch(() => primaryColor.value, () => {
    if (mapInstance.value && props.data && props.data.length > 0) {
        updateMap(props.data);
    }
});

// 初始化地图
const initMap = () => {
    if (mapContainer.value) {
        mapInstance.value = echarts.init(mapContainer.value);

        // 生成基于主题色的颜色渐变
        const baseColor = primaryColor.value;
        const colorArray = generateColorGradient(baseColor, 5);

        const option = {
            title: {
                text: '省份提及热力图',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c}次'
            },
            visualMap: {
                min: 0,
                max: 200,
                left: 'left',
                top: 'bottom',
                text: ['高', '低'],
                calculable: true,
                inRange: {
                    color: colorArray
                }
            },
            series: [
                {
                    name: '提及次数',
                    type: 'map',
                    map: 'china',
                    roam: true,
                    aspectScale: 0.75,
                    zoom: 1.2,
                    label: {
                        show: false  // 默认不显示标签
                    },
                    emphasis: {
                        label: {
                            show: true  // 鼠标悬停时显示标签
                        },
                        itemStyle: {
                            areaColor: baseColor
                        }
                    },
                    data: []
                }
            ]
        };

        mapInstance.value.setOption(option);
    }
};

// 生成颜色渐变数组
const generateColorGradient = (baseColor, steps) => {
    // 将颜色转换为RGB
    let rgb;
    if (baseColor.startsWith('#')) {
        const hex = baseColor.slice(1);
        rgb = {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16)
        };
    } else if (baseColor.startsWith('rgb')) {
        const matches = baseColor.match(/\d+/g);
        rgb = {
            r: parseInt(matches[0]),
            g: parseInt(matches[1]),
            b: parseInt(matches[2])
        };
    } else {
        // 默认颜色
        rgb = { r: 59, g: 130, b: 246 }; // 蓝色
    }

    // 生成从浅到深的颜色
    const colors = [];
    for (let i = 0; i < steps; i++) {
        const factor = i / (steps - 1);
        const r = Math.round(255 - (255 - rgb.r) * factor);
        const g = Math.round(255 - (255 - rgb.g) * factor);
        const b = Math.round(255 - (255 - rgb.b) * factor);
        colors.push(`rgb(${r}, ${g}, ${b})`);
    }

    return colors;
};

// 更新地图数据
const updateMap = (data) => {
    if (mapInstance.value) {
        console.log('更新地图的原始数据:', data);

        // 省份名称映射
        const provinceNameMap = {
        };

        // 确保数据格式正确
        const mapData = data.map(item => {
            // 确保province和mentions字段存在且类型正确
            let provinceName = item.province || '';
            // 应用名称映射（如果有）
            provinceName = provinceNameMap[provinceName] || provinceName;
            const mentionsValue = parseInt(item.mentions) || 0;

            return {
                name: provinceName,
                value: mentionsValue
            };
        });

        console.log('转换后的地图数据:', mapData);

        // 找出最大值用于visualMap设置
        const values = mapData.map(item => item.value);
        const maxValue = values.length > 0 ? Math.max(...values) : 200;

        // 生成基于主题色的颜色渐变
        const baseColor = primaryColor.value;
        const colorArray = generateColorGradient(baseColor, 5);

        mapInstance.value.setOption({
            visualMap: {
                max: maxValue,
                inRange: {
                    color: colorArray
                }
            },
            series: [
                {
                    data: mapData,
                    emphasis: {
                        itemStyle: {
                            areaColor: baseColor
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
            console.log('地图组件获取到的数据:', response.data);
            updateMap(response.data);
        }
    } catch (error) {
        console.error('获取省份提及数据失败:', error);
    }
};

// 窗口大小变化时调整图表大小
window.addEventListener('resize', () => {
    if (mapInstance.value) {
        mapInstance.value.resize();
    }
});
</script>

<template>
    <div ref="mapContainer" style="width: 100%; height: 100%;"></div>
</template>
