<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 选项数据
const options = [
  { value: 'A', text: '选项1' },
  { value: 'B', text: '选项2' },
  { value: 'C', text: '选项3' },
  { value: 'D', text: '选项4' }
];

const questionType = "单选题"

// 响应式状态
const isNextBtnDisabled = ref(true);
const selectedOption = ref<string | null>(null);

// 处理选项选择
const handleOptionChange = (option: string) => {
  selectedOption.value = option;
  isNextBtnDisabled.value = false;
};

// 处理下一题点击
const handleNextClick = () => {
  // 这里可以添加切换题目的逻辑
  // 示例：弹出提示，实际项目中可替换为加载新题目
  alert('已选择答案，即将进入下一题！');

  // 重置选项和按钮状态（模拟切换题目）
  selectedOption.value = null;
  isNextBtnDisabled.value = true;

  // 实际项目中可通过AJAX加载新题目，或切换隐藏的题目面板
};

// 生命周期钩子
onMounted(() => {
  // 组件挂载后的初始化逻辑
});
</script>

<template>
  <div class="quiz-card">
    <!-- 题目区域 -->
    <div class="question-container">
      <div class="question-title">问题</div>
      <div class="question-content"></div>
    </div>

    <!-- 选项区域 -->
    <div v-if="questionType == '单选题'" class="options-container">
      <div class="option-item" v-for="option in options" :key="option.value">
        <input 
          type="radio" 
          :name="'option'" 
          :id="`option${option.value}`" 
          class="option-input"
          :checked="selectedOption === option.value"
          @change="handleOptionChange(option.value)"
        >
        <label :for="`option${option.value}`" class="custom-radio">
          <span class="radio-letter">{{ option.value }}</span>
        </label>
        <span class="option-text">{{ option.text }}</span>
      </div>
    </div>

    <!-- 下一题按钮 -->
    <button 
      class="next-btn" 
      :disabled="isNextBtnDisabled"
      @click="handleNextClick"
    >
      下一题
    </button>
  </div>
</template>

<style scoped>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Microsoft Yahei", sans-serif;
}

/* 答题卡片容器 */
.quiz-card {
  width: 500px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  margin-top: 50px;
}

/* 题目区域 */
.question-container {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.question-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.question-content {
  font-size: 16px;
  color: #555;
  line-height: 1.6;
}

/* 选项容器 */
.options-container {
  margin-bottom: 30px;
}

/* 单个选项样式 */
.option-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
}

/* 隐藏原生单选按钮 */
.option-input {
  display: none;
}

/* 自定义圆点样式 */
.custom-radio {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  position: relative;
  transition: all 0.3s ease;
}

/* 字母样式 */
.radio-letter {
  font-size: 16px;
  font-weight: bold;
  color: #666;
}

/* 选项文本 */
.option-text {
  font-size: 16px;
  color: #333;
}

/* 选中状态样式 */
.option-input:checked + .custom-radio {
  background-color: #409eff;
  border-color: #409eff;
}

.option-input:checked + .custom-radio .radio-letter {
  color: white;
}

/* 最后一个选项去掉下边距 */
.option-item:last-child {
  margin-bottom: 0;
}

/* 下一题按钮样式 */
.next-btn {
  width: 100%;
  height: 44px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.next-btn:hover {
  background-color: #3388ee;
}

.next-btn:disabled {
  background-color: #b3d4fc;
  cursor: not-allowed;
}
</style>