<!-- src/components/WoundPrediction.vue -->
<template>
    <div class="container">
      <div class="left-section">
        <div class="image-container">
          <img
            v-if="image1"
            :src="image1"
            alt="Image 1"
            class="image"
          />
          <div v-else class="placeholder">图片1</div>
        </div>
        <div class="image-container">
          <img
            v-if="image2"
            :src="image2"
            alt="Image 2"
            class="image"
          />
          <div v-else class="placeholder">图片2</div>
        </div>
      </div>
      <div class="right-section">
        <Button label="上传" icon="pi pi-upload" class="p-button-success" @click="uploadImage" />
        <input
          type="file"
          ref="fileInput"
          @change="handleFileUpload"
          style="display: none"
          accept="image/*"
        />
        <Button label="预测" icon="pi pi-cog" class="p-button-primary" @click="predict" :disabled="loading" />
        <ProgressSpinner v-if="loading" style="width:50px;height:50px"></ProgressSpinner>
        <div class="output" v-if="woundArea !== null">
          伤口面积: {{ woundArea }} 平方厘米
        </div>
      </div>
    </div>
  </template>

  <script>
  import { ref } from 'vue';
  import axios from 'axios';
  import Button from 'primevue/button';
  import ProgressSpinner from 'primevue/progressspinner';

  export default {
    name: 'WoundPrediction',
    components: {
      Button,
      ProgressSpinner,
    },
    setup() {
      const image1 = ref(null);
      const image2 = ref(null);
      const fileInput = ref(null);
      const woundArea = ref(null);
      const loading = ref(false);

      // 触发文件选择
      const uploadImage = () => {
        fileInput.value.click();
      };

      // 处理文件上传
      const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            image1.value = e.target.result;
            // 清除之前的预测结果
            image2.value = null;
            woundArea.value = null;
          };
          reader.readAsDataURL(file);
        } else {
          alert('请选择一张有效的图片文件');
        }
      };

      // 调用预测 API
      const predict = async () => {
        if (!image1.value) {
          alert('请先上传一张图片');
          return;
        }

        loading.value = true;
        try {
          // 将图片转换为 Blob
          const response = await fetch(image1.value);
          const blob = await response.blob();
          const formData = new FormData();
          formData.append('file', blob, 'uploaded_image.png');

          // 调用你的预测 API
          const res = await axios.post('/api/predict', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // 假设 API 返回预测后的图片 URL 和伤口面积
          image2.value = res.data.predictedImageUrl;
          woundArea.value = res.data.woundArea;
        } catch (error) {
          console.error('预测失败:', error);
          alert('预测失败，请稍后再试');
        } finally {
          loading.value = false;
        }
      };

      return {
        image1,
        image2,
        fileInput,
        uploadImage,
        handleFileUpload,
        predict,
        woundArea,
        loading,
      };
    },
  };
  </script>

  <style scoped>
  .container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding: 20px;
    border-radius: 15px;
    background-color: #f9f9f9;
  }

  .left-section,
  .right-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .left-section {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .right-section {
    flex: 1;
    align-items: flex-start;
  }

  .image-container {
    width: 100%;
    height: 300px;
    border: 2px dashed #ccc;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    background-color: #ffffff;
  }

  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 15px;
  }

  .placeholder {
    color: #aaa;
    font-size: 18px;
  }

  .output {
    margin-top: 20px;
    font-size: 18px;
    color: #333;
  }
  </style>
