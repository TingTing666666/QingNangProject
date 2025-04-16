<template>
  <div class="home-page">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="subtitle-badge">研究报告</div>
        <h1 class="hero-title">"信任为桥，镜头为媒"</h1>
        <p class="hero-subtitle">过境免签政策下中国形象在境外旅客自媒体中的塑造与传播</p>
        <p class="hero-description">基于3000条境外旅客视频的深入调查报告</p>
        <Button label="查看研究成果" class="hero-button" icon="pi pi-arrow-right" iconPos="right" />
      </div>
    </section>

    <!-- 研究概述 -->
    <section class="overview-section">
      <div class="container">
        <div class="section-header">
          <h2>研究概述</h2>
          <div class="divider"></div>
        </div>
        <div class="overview-content">
          <p>自2013年中国实施72小时过境免签政策起，政策范围不断扩大，从72小时到144小时，目前已全面放宽至240小时，覆盖21个省（区、市）。本研究通过分析境外旅客自媒体视频，探究过境免签政策对中国国际形象的影响与塑造。</p>
        </div>
        <div class="policy-timeline">
          <div class="timeline-item">
            <div class="timeline-icon">72h</div>
            <div class="timeline-content">
              <h4>72小时过境免签</h4>
              <p>2013年 - 2024年7月</p>
              <div class="timeline-stats">
                <div class="stat">
                  <span class="value">9</span>
                  <span class="label">适用口岸</span>
                </div>
                <div class="stat">
                  <span class="value">45</span>
                  <span class="label">适用国家</span>
                </div>
              </div>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-icon">144h</div>
            <div class="timeline-content">
              <h4>144小时过境免签</h4>
              <p>2024年7月 - 2024年12月</p>
              <div class="timeline-stats">
                <div class="stat">
                  <span class="value">27</span>
                  <span class="label">适用口岸</span>
                </div>
                <div class="stat">
                  <span class="value">51</span>
                  <span class="label">适用国家</span>
                </div>
              </div>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-icon">240h</div>
            <div class="timeline-content">
              <h4>240小时过境免签</h4>
              <p>2024年12月 - 至今</p>
              <div class="timeline-stats">
                <div class="stat">
                  <span class="value">50</span>
                  <span class="label">适用口岸</span>
                </div>
                <div class="stat">
                  <span class="value">54</span>
                  <span class="label">适用国家</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 研究目的 -->
    <section class="purpose-section">
      <div class="container">
        <div class="section-header">
          <h2>研究目的</h2>
          <div class="divider"></div>
        </div>
        <div class="purpose-grid">
          <div class="purpose-card" v-for="(purpose, index) in researchPurposes" :key="index">
            <div class="purpose-icon">
              <i :class="purpose.icon"></i>
            </div>
            <h3>{{ purpose.title }}</h3>
            <p>{{ purpose.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 研究数据 -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-wrapper">
          <div class="stat-item" v-for="(stat, index) in researchStats" :key="index">
            <h3>{{ stat.value }}</h3>
            <p>{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 研究方法 -->
    <section class="methodology-section">
      <div class="container">
        <div class="section-header">
          <h2>研究方法</h2>
          <div class="divider"></div>
        </div>
        <div class="methodology-content">
          <div class="methodology-image">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="研究方法">
          </div>
          <div class="methodology-text">
            <div class="methodology-item" v-for="(method, index) in researchMethods" :key="index">
              <h4><i :class="method.icon"></i> {{ method.title }}</h4>
              <p>{{ method.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 发现问题 -->
    <section class="findings-section">
      <div class="container">
        <div class="section-header">
          <h2>主要发现</h2>
          <div class="divider"></div>
        </div>
        <div class="findings-slider">
          <div class="finding-card" v-for="(finding, index) in researchFindings" :key="index">
            <div class="finding-icon">
              <i :class="finding.icon"></i>
            </div>
            <h3>{{ finding.title }}</h3>
            <p>{{ finding.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部CTA -->
    <section class="cta-section">
      <div class="container">
        <h2>探索完整研究报告</h2>
        <p>深入了解过境免签政策下中国形象的塑造与传播</p>
        <a href="/assets/report-sample.pdf" download="信任为桥_镜头为媒_研究报告.pdf">
          <Button label="下载研究报告" icon="pi pi-download" class="cta-button" />
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const researchPurposes = ref([
  {
    icon: 'pi pi-chart-line',
    title: '政策评估与优化',
    description: '评估过境免签政策实施成效，为政策制定者提供数据支撑，优化政策覆盖范围与实施路径'
  },
  {
    icon: 'pi pi-globe',
    title: '中国形象塑造研究',
    description: '分析境外旅客自媒体中呈现的中国形象核心要素，对比与传统媒体报道的差异，验证自媒体对刻板印象的修正作用'
  },
  {
    icon: 'pi pi-comments',
    title: '跨文化传播分析',
    description: '探究中国文化、习俗、景观如何被不同文化背景的旅客解读、编码与传播，明确文化差异引发的传播表现'
  },
  {
    icon: 'pi pi-map',
    title: '文旅融合推动',
    description: '追溯旅客视频中文旅融合接触点与体验深度，为文旅融合QUALITY提升提供理论与实践范例'
  },
  {
    icon: 'pi pi-users',
    title: '人文交流强化',
    description: '剖析旅客视频叙事中跨越国界的情感连接与文化互动，夯实人类命运共同体的民意基础与情感根基'
  },
  {
    icon: 'pi pi-volume-up',
    title: '话语体系优化',
    description: '评估政策如何通过游客自发性传播提升中国国际叙事能力，推动"他者叙事"向"多元共塑"转化'
  }
]);

const researchStats = ref([
  { value: '3000+', label: '分析视频数量' },
  { value: '10亿+', label: 'China Travel话题流量' },
  { value: '54', label: '适用国家数量' },
  { value: '240h', label: '最长免签时间' }
]);

const researchMethods = ref([
  {
    icon: 'pi pi-database',
    title: '大数据采集与分析',
    description: '运用Python爬虫技术收集过境免签政策推出后外国游客上传的"China Travel"系列视频，建构数据库'
  },
  {
    icon: 'pi pi-chart-bar',
    title: '量化研究',
    description: '整理视频流量数据，分析视频关键帧，进行视频分词，梳理游玩地点、旅行体验和叙事角度特征'
  },
  {
    icon: 'pi pi-comment',
    title: '质性研究',
    description: '对视频内容和评论进行编码分析，提炼主题、归纳叙事类型，分析其对中国形象的塑造方式'
  },
  {
    icon: 'pi pi-users',
    title: '实地调研',
    description: '采用线上与线下相结合的调研方式，采访外国游客对于免签政策的认知和自身体验'
  }
]);

const researchFindings = ref([
  {
    icon: 'pi pi-map-marker',
    title: '旅游路线演变',
    description: '随着免签时长延长，境外旅客旅游路线从单一城市向多城市联游转变，深度体验中国文化的需求显著增加'
  },
  {
    icon: 'pi pi-heart',
    title: '情感连接增强',
    description: '通过视频分享，境外旅客与中国文化建立了更深层次的情感连接，成为民间人文交流的重要使者'
  },
  {
    icon: 'pi pi-eye',
    title: '形象认知转变',
    description: '从视频内容分析发现，境外旅客对中国的认知从片面刻板印象向多元立体真实转变'
  },
  {
    icon: 'pi pi-share-alt',
    title: '传播效能提升',
    description: '自媒体视频传播比官方宣传具有更高的可信度和影响力，成为塑造中国国际形象的重要渠道'
  }
]);

</script>

<style scoped>
.home-page {
  scroll-behavior: smooth;
  color: #333;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

/* 英雄区域 */
.hero-section {
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
              url('https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  position: relative;
}

.hero-content {
  max-width: 800px;
  padding: 0 2rem;
}

.subtitle-badge {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.178);
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.183);
}

.hero-content h1, .hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  color: white;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 300;
}

.hero-description {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-button {
  padding: 1rem 2rem;
  font-size: 1rem;
  border-radius: 50px;
  background-color: var(--primary-color);
  border: none;
  transition: all 0.3s ease;
}

.hero-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* 研究概述 */
.overview-section {
  padding: 5rem 0;
  background-color: #fff;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.divider {
  width: 60px;
  height: 4px;
  background-color: var(--primary-color);
  margin: 0 auto;
}

.overview-content {
  max-width: 800px;
  margin: 0 auto 3rem;
  text-align: center;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
}

.policy-timeline {
  display: flex;
  justify-content: space-between;
  margin-top: 4rem;
  position: relative;
}

.policy-timeline::before {
  content: '';
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #eee;
  z-index: 1;
}

.timeline-item {
  flex: 1;
  text-align: center;
  padding: 0 1rem;
  position: relative;
  z-index: 2;
}

.timeline-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.timeline-content {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.timeline-content:hover {
  transform: translateY(-5px);
}

.timeline-content h4 {
  margin: 0 0 0.5rem;
  color: #333;
}

.timeline-content p {
  color: #777;
  margin-bottom: 1rem;
}

.timeline-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.stat {
  text-align: center;
}

.stat .value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.stat .label {
  font-size: 0.9rem;
  color: #6b6a6a;
}

/* 研究目的 */
.purpose-section {
  padding: 5rem 0;
  background-color: #f8f9fa;
}

.purpose-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.purpose-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  height: 100%;
}

.purpose-card:hover {
  transform: translateY(-5px);
}

.purpose-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(var(--primary-color-rgb), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.purpose-icon i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.purpose-card h3 {
  margin: 0 0 1rem;
  font-size: 1.3rem;
  color: #333;
}

.purpose-card p {
  color: #666;
  line-height: 1.6;
}

/* 研究数据 */
.stats-section {
  padding: 4rem 0;
  background-color: var(--primary-color);
  color: white;
}

.stats-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  text-align: center;
}

.stat-item {
  padding: 2rem;
  flex: 1;
  min-width: 200px;
}

.stat-item h3 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-item p {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* 研究方法 */
.methodology-section {
  padding: 5rem 0;
  background-color: white;
}

.methodology-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 3rem;
  margin-top: 3rem;
}

.methodology-image {
  flex: 1;
  min-width: 300px;
}

.methodology-image img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.methodology-text {
  flex: 1;
  min-width: 300px;
}

.methodology-item {
  margin-bottom: 2rem;
}

.methodology-item h4 {
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
}

.methodology-item h4 i {
  margin-right: 0.8rem;
  color: var(--primary-color);
}

.methodology-item p {
  color: #666;
  line-height: 1.6;
}

/* 发现问题 */
.findings-section {
  padding: 5rem 0;
  background-color: #f8f9fa;
}

.findings-slider {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.finding-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
  border-top: 4px solid var(--primary-color);
}

.finding-card:hover {
  transform: translateY(-5px);
}

.finding-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(var(--primary-color-rgb), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.finding-icon i {
  font-size: 1.3rem;
  color: var(--primary-color);
}

.finding-card h3 {
  margin: 0 0 1rem;
  font-size: 1.3rem;
  color: #333;
}

.finding-card p {
  color: #666;
  line-height: 1.6;
}

/* CTA区域 */
.cta-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-darker) 100%);
  color: white;
  text-align: center;
}

.cta-section h2 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.cta-section p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  border-radius: 50px;
  background-color: white;
  color: var(--primary-color);
  border: none;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .policy-timeline {
    flex-direction: column;
    gap: 2rem;
  }

  .policy-timeline::before {
    display: none;
  }

  .timeline-item {
    margin-bottom: 2rem;
  }

  .methodology-content {
    flex-direction: column;
  }

  .stat-item {
    min-width: 150px;
  }
}
</style>
