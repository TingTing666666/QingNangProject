<script setup>
import { ref, onMounted, computed } from 'vue';

// 聊天历史记录
const chatHistory = ref([
    {
        role: 'assistant',
        content: '欢迎使用"旅行镜像"AI分析助手！我可以帮助您分析外国游客的旅行数据、情感倾向和文化体验。请问您想了解什么？',
        timestamp: new Date().toISOString()
    }
]);

// 用户输入
const userInput = ref('');

// 分析模式选项
const analysisModes = ref([
    { label: '情感分析', value: 'sentiment', icon: 'pi pi-heart' },
    { label: '路线规划', value: 'route', icon: 'pi pi-map-marker' },
    { label: '文化体验', value: 'culture', icon: 'pi pi-globe' },
    { label: '消费分析', value: 'spending', icon: 'pi pi-money-bill' }
]);

// 当前选择的分析模式
const selectedMode = ref('sentiment');

// 是否显示高级选项
const showAdvancedOptions = ref(false);

// 是否正在处理消息
const isProcessing = ref(false);

// 示例问题
const sampleQuestions = ref([
    '分析过境免签政策对旅游体验的影响',
    '外国游客对中国美食的评价如何？',
    '72小时和144小时过境免签的游客行为差异',
    '哪些城市在外国游客视频中获得最高评分？'
]);

// 数据过滤选项
const filterOptions = ref({
    timeRange: 'all', // all, 72h, 144h, 240h
    nationality: 'all',
    ageGroup: 'all',
    travelPurpose: 'all'
});

// 时间范围选项
const timeRangeOptions = ref([
    { label: '全部时间', value: 'all' },
    { label: '72小时过境免签', value: '72h' },
    { label: '144小时过境免签', value: '144h' },
    { label: '240小时过境免签', value: '240h' }
]);

// 国籍选项
const nationalityOptions = ref([
    { label: '全部国籍', value: 'all' },
    { label: '美国', value: 'us' },
    { label: '英国', value: 'uk' },
    { label: '法国', value: 'fr' },
    { label: '德国', value: 'de' },
    { label: '日本', value: 'jp' },
    { label: '韩国', value: 'kr' },
    { label: '澳大利亚', value: 'au' }
]);

// 年龄组选项
const ageGroupOptions = ref([
    { label: '全部年龄', value: 'all' },
    { label: '18-24岁', value: '18-24' },
    { label: '25-34岁', value: '25-34' },
    { label: '35-44岁', value: '35-44' },
    { label: '45-54岁', value: '45-54' },
    { label: '55岁以上', value: '55+' }
]);

// 旅行目的选项
const travelPurposeOptions = ref([
    { label: '全部目的', value: 'all' },
    { label: '观光旅游', value: 'tourism' },
    { label: '商务出差', value: 'business' },
    { label: '探亲访友', value: 'family' },
    { label: '学术交流', value: 'academic' },
    { label: '文化体验', value: 'culture' }
]);

// 模拟AI思考过程
const thinking = ref(false);

// 发送消息
const sendMessage = () => {
    if (!userInput.value.trim() || isProcessing.value) return;

    // 添加用户消息到聊天历史
    chatHistory.value.push({
        role: 'user',
        content: userInput.value,
        timestamp: new Date().toISOString()
    });

    // 清空输入框
    const userQuestion = userInput.value;
    userInput.value = '';

    // 模拟AI思考
    thinking.value = true;
    isProcessing.value = true;

    // 模拟API调用延迟
    setTimeout(() => {
        thinking.value = false;

        // 根据分析模式和问题生成回答
        let response = generateResponse(userQuestion, selectedMode.value, filterOptions.value);

        // 添加AI回复到聊天历史
        chatHistory.value.push({
            role: 'assistant',
            content: response,
            timestamp: new Date().toISOString(),
            mode: selectedMode.value
        });

        isProcessing.value = false;
    }, 1500);
};

// 根据问题和模式生成回答
const generateResponse = (question, mode, filters) => {
    // 这里是模拟的回答生成逻辑，实际应用中应该调用后端API
    const responses = {
        sentiment: [
            `根据我对3000+视频样本的分析，在${filters.timeRange === 'all' ? '所有过境免签政策时期' : filters.timeRange + '过境免签政策时期'}，外国游客对中国旅行体验的情感倾向总体呈现积极态势。积极评价占比达到68%，中性评价占比25%，负面评价仅占7%。`,
            '情感分析显示，外国游客对中国美食的评价极为正面，满意度高达92%。其中，街头小吃、地方特色菜和餐厅服务是获赞最多的方面。',
            '通过对视频评论的情感分析，我发现随着过境免签时间的延长，游客的满意度呈现上升趋势。240小时免签政策下的满意度比72小时时期提高了15个百分点。'
        ],
        route: [
            '分析表明，72小时过境免签游客倾向于单一城市深度游，而144小时和240小时过境免签游客则更多选择多城市联游。北京-上海-杭州和广州-深圳-香港是最受欢迎的联游路线。',
            '根据视频地理标签分析，外国游客在中国的热门目的地排名为：1.上海 2.北京 3.成都 4.广州 5.西安。其中成都的排名在240小时过境免签政策后显著提升。',
            '数据显示，随着过境免签时间延长，游客平均停留城市数从1.2个(72小时)增加到2.8个(144小时)和3.5个(240小时)，旅行半径扩大了约2.3倍。'
        ],
        culture: [
            '文化体验分析显示，外国游客最感兴趣的中国文化元素依次是：1.美食文化 2.历史古迹 3.现代都市生活 4.传统艺术 5.自然风光。',
            '视频内容分析表明，外国游客对中国传统文化体验的参与度随着停留时间延长而增加。240小时过境免签游客参与文化体验活动的比例比72小时高出40%。',
            '跨文化分析发现，来自不同国家的游客对中国文化元素的偏好存在差异。欧美游客更关注历史文化，而亚洲游客则更关注现代城市生活和科技发展。'
        ],
        spending: [
            '消费数据分析显示，过境免签游客在中国的平均消费为每人每天约180美元，其中餐饮占30%，住宿占35%，购物占20%，交通和其他占15%。',
            '随着过境免签时间延长，游客在文化体验和特色商品上的支出比例明显增加。240小时过境免签游客在这些方面的支出比72小时高出约25%。',
            '数据表明，使用移动支付的外国游客比例从2023年的45%上升到2024年的78%，这显著提升了他们的消费体验和满意度。'
        ]
    };

    // 根据问题关键词匹配回答
    if (question.includes('免签政策') || question.includes('政策影响')) {
        return responses.sentiment[0];
    } else if (question.includes('美食') || question.includes('餐饮')) {
        return responses.sentiment[1];
    } else if (question.includes('差异') || question.includes('比较')) {
        return responses.route[0];
    } else if (question.includes('城市') || question.includes('评分')) {
        return responses.route[1];
    } else if (question.includes('文化') || question.includes('传统')) {
        return responses.culture[0];
    } else if (question.includes('消费') || question.includes('支出')) {
        return responses.spending[0];
    }

    // 默认返回当前模式的第一个回答
    return responses[mode][0];
};

// 使用示例问题
const useQuestion = (question) => {
    userInput.value = question;
    sendMessage();
};

// 格式化时间
const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// 计算聊天容器的样式
const chatContainerStyle = computed(() => {
    return {
        height: showAdvancedOptions.value ? 'calc(100vh - 380px)' : 'calc(100vh - 280px)'
    };
});

// 滚动到最新消息
const scrollToBottom = () => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
};

// 监听聊天历史变化，自动滚动到底部
onMounted(() => {
    scrollToBottom();
});

// 当聊天历史更新时，滚动到底部
const watchChatHistory = computed(() => chatHistory.value.length);
watchChatHistory.value; // 触发计算属性
setTimeout(scrollToBottom, 100);

// 切换高级选项显示
const toggleAdvancedOptions = () => {
    showAdvancedOptions.value = !showAdvancedOptions.value;
    setTimeout(scrollToBottom, 100);
};

// 重置聊天
const resetChat = () => {
    chatHistory.value = [
        {
            role: 'assistant',
            content: '欢迎使用"旅行镜像"AI分析助手！我可以帮助您分析外国游客的旅行数据、情感倾向和文化体验。请问您想了解什么？',
            timestamp: new Date().toISOString()
        }
    ];
};
</script>

<template>
    <div class="travel-ai-container">
        <!-- 头部 -->
        <div class="ai-header">
            <div class="ai-title">
                <i class="pi pi-globe mr-2"></i>
                <span>旅行镜像 AI</span>
                <span class="version-badge">Beta</span>
            </div>
            <div class="ai-subtitle">基于3000+外国游客视频的旅行分析助手</div>
        </div>

        <!-- 分析模式选择 -->
        <div class="analysis-mode-selector">
            <span class="mode-label">分析模式：</span>
            <div class="mode-buttons">
                <Button v-for="mode in analysisModes" :key="mode.value"
                    :class="['mode-button', {'mode-active': selectedMode === mode.value}]"
                    :icon="mode.icon"
                    :label="mode.label"
                    @click="selectedMode = mode.value"
                    :outlined="selectedMode !== mode.value"
                    :text="selectedMode !== mode.value"
                    :severity="selectedMode === mode.value ? 'primary' : 'secondary'"
                    class="p-button-sm"
                />
            </div>
            <Button icon="pi pi-sliders-h"
                @click="toggleAdvancedOptions"
                class="p-button-text p-button-sm filter-button"
                :class="{'filter-active': showAdvancedOptions}"
                :label="showAdvancedOptions ? '隐藏筛选' : '显示筛选'"
            />
        </div>

        <!-- 高级筛选选项 -->
        <div class="advanced-options" v-if="showAdvancedOptions">
            <div class="filter-row">
                <div class="filter-group">
                    <label>时间范围</label>
                    <Dropdown v-model="filterOptions.timeRange" :options="timeRangeOptions" optionLabel="label" optionValue="value" class="w-full" />
                </div>
                <div class="filter-group">
                    <label>游客国籍</label>
                    <Dropdown v-model="filterOptions.nationality" :options="nationalityOptions" optionLabel="label" optionValue="value" class="w-full" />
                </div>
            </div>
            <div class="filter-row">
                <div class="filter-group">
                    <label>年龄组</label>
                    <Dropdown v-model="filterOptions.ageGroup" :options="ageGroupOptions" optionLabel="label" optionValue="value" class="w-full" />
                </div>
                <div class="filter-group">
                    <label>旅行目的</label>
                    <Dropdown v-model="filterOptions.travelPurpose" :options="travelPurposeOptions" optionLabel="label" optionValue="value" class="w-full" />
                </div>
            </div>
        </div>

        <!-- 聊天容器 -->
        <div class="chat-container" :style="chatContainerStyle">
            <div v-for="(message, index) in chatHistory" :key="index"
                :class="['message-wrapper', message.role === 'user' ? 'user-message' : 'ai-message']">
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-sender">{{ message.role === 'user' ? '您' : '旅行镜像 AI' }}</span>
                        <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                    </div>
                    <div class="message-body">
                        {{ message.content }}
                    </div>
                    <div v-if="message.role === 'assistant' && message.mode" class="message-footer">
                        <span class="analysis-badge">
                            <i :class="analysisModes.find(m => m.value === message.mode)?.icon"></i>
                            {{ analysisModes.find(m => m.value === message.mode)?.label }}分析
                        </span>
                    </div>
                </div>
            </div>

            <!-- 思考中状态 -->
            <div v-if="thinking" class="thinking-indicator">
                <div class="thinking-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="thinking-text">正在分析数据...</div>
            </div>
        </div>

        <!-- 示例问题 -->
        <div class="sample-questions">
            <div class="sample-title">示例问题：</div>
            <div class="sample-buttons">
                <Button v-for="(question, index) in sampleQuestions" :key="index"
                    :label="question"
                    class="p-button-outlined p-button-sm sample-button"
                    @click="useQuestion(question)"
                    :disabled="isProcessing"
                />
            </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-container">
            <div class="input-wrapper">
                <InputText v-model="userInput" placeholder="输入您的问题..." class="chat-input"
                    @keyup.enter="sendMessage" :disabled="isProcessing" />
                <Button icon="pi pi-send" class="send-button" @click="sendMessage"
                    :disabled="!userInput.trim() || isProcessing" />
                <Button icon="pi pi-refresh" class="reset-button p-button-text" @click="resetChat"
                    title="重置对话" :disabled="isProcessing" />
            </div>
            <div class="input-footer">
                <small>旅行镜像AI基于3000+外国游客视频数据训练，专注于过境免签政策下的旅游体验分析</small>
            </div>
        </div>
    </div>
</template>

<style scoped>
.travel-ai-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: var(--surface-ground);
    font-family: var(--font-family);
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.ai-header {
    text-align: center;
    margin-bottom: 1.5rem;
}

.ai-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;
}

.version-badge {
    background-color: var(--primary-color);
    color: white;
    font-size: 0.7rem;
    padding: 0.1rem 0.5rem;
    border-radius: 10px;
    margin-left: 0.5rem;
}

.ai-subtitle {
    font-size: 0.9rem;
    color: var(--text-color-secondary);
    margin-top: 0.25rem;
}

.analysis-mode-selector {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    background-color: var(--surface-card);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.mode-label {
    font-weight: 600;
    margin-right: 0.75rem;
    color: var(--text-color-secondary);
    white-space: nowrap;
}

.mode-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    flex-grow: 1;
}

.mode-button {
    transition: all 0.2s ease;
}

.mode-active {
    font-weight: 600;
}

.filter-button {
    margin-left: auto;
}

.filter-active {
    color: var(--primary-color);
}

.advanced-options {
    background-color: var(--surface-card);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    animation: slideDown 0.3s ease;
}

@keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.filter-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.75rem;
}

.filter-row:last-child {
    margin-bottom: 0;
}

.filter-group {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.filter-group label {
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
    color: var(--text-color-secondary);
}

.chat-container {
    flex-grow: 1;
    overflow-y: auto;
    padding: 1rem;
    background-color: var(--surface-card);
    border-radius: 8px;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.message-wrapper {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
}

.user-message {
    align-items: flex-end;
}

.ai-message {
    align-items: flex-start;
}

.message-content {
    max-width: 80%;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.user-message .message-content {
    background-color: var(--primary-color);
    color: white;
    border-top-right-radius: 4px;
}

.ai-message .message-content {
    background-color: var(--surface-section);
    color: var(--text-color);
    border-top-left-radius: 4px;
}

.message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
}

.user-message .message-header {
    color: rgba(255, 255, 255, 0.9);
}

.ai-message .message-header {
    color: var(--text-color-secondary);
}

.message-sender {
    font-weight: 600;
}

.message-time {
    font-size: 0.75rem;
    opacity: 0.8;
}

.message-body {
    line-height: 1.5;
}

.message-footer {
    margin-top: 0.75rem;
    display: flex;
    justify-content: flex-end;
}

.analysis-badge {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--text-color-secondary);
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.thinking-indicator {
    display: flex;
    align-items: center;
    margin: 1rem 0;
}

.thinking-dots {
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
}

.thinking-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--primary-color);
    margin-right: 4px;
    animation: pulse 1.5s infinite ease-in-out;
}

.thinking-dots span:nth-child(2) {
    animation-delay: 0.2s;
}

.thinking-dots span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes pulse {
    0%, 100% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 1; }
}

.thinking-text {
    font-size: 0.9rem;
    color: var(--text-color-secondary);
}

.sample-questions {
    margin-bottom: 1rem;
}

.sample-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-color-secondary);
    margin-bottom: 0.5rem;
}

.sample-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.sample-button {
    font-size: 0.85rem;
    white-space: normal;
    text-align: left;
    height: auto;
    padding: 0.4rem 0.75rem;
    border-radius: 20px;
}

.input-container {
    background-color: var(--surface-card);
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.input-wrapper {
    display: flex;
    gap: 0.5rem;
}

.chat-input {
    flex-grow: 1;
    border-radius: 20px;
    padding: 0.75rem 1rem;
}

.send-button {
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
}

.reset-button {
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
}

.input-footer {
    margin-top: 0.5rem;
    text-align: center;
    color: var(--text-color-secondary);
    font-size: 0.8rem;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .travel-ai-container {
        padding: 1rem;
    }

    .analysis-mode-selector {
        flex-direction: column;
        align-items: flex-start;
    }

    .mode-label {
        margin-bottom: 0.5rem;
    }

    .filter-button {
        margin-left: 0;
        margin-top: 0.5rem;
    }

    .filter-row {
        flex-direction: column;
        gap: 0.75rem;
    }

    .message-content {
        max-width: 90%;
    }
}
</style>
