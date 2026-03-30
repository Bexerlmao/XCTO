<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElCheckbox, ElCheckboxGroup, ElButton } from 'element-plus';

// 题目数据接口定义
interface QuestionOption {
  value: string;
  text: string;
}

interface Question {
  id: string;
  type: '单选题' | '多选题' | '判断题' | '填空题';
  content: string;
  options: QuestionOption[];
}

// 响应式状态
const questionType = ref<'单选题' | '多选题' | '判断题' | '填空题'>('单选题');
const questionContent = ref('');
const options = ref<QuestionOption[]>([]);
const isNextBtnDisabled = ref(true);
const selectedOption = ref<string | null>(null);
const selectedOptions = ref<string[]>([]);
const fillBlankAnswers = ref<string[]>([]);
const isLoading = ref(false);

// 异步获取题目函数（预留接口）
const fetchQuestion = async (type?: '单选题' | '多选题' | '判断题' | '填空题') => {
  try {
    isLoading.value = true;
    
    // TODO: 替换为实际的API调用
    // 示例：const response = await axios.get('/api/question/random', { params: { type } });
    // const data = response.data;
    
    // 模拟API响应数据
    let mockData: Question;

    //TODO: 删除debug

    type = '填空题'

    if (type === '判断题') {
      mockData = {
        id: '1',
        type: '判断题',
        content: '这是一道测试判断题，请判断对错。',
        options: [
          { value: 'true', text: '正确' },
          { value: 'false', text: '错误' }
        ]
      };
    } else if (type === '填空题') {
      mockData = {
        id: '1',
        type: '填空题',
        content: '请填写以下空白处：Vue 3 的核心特性包括 Composition API、______ 和 ______。',
        options: []
      };
    } else {
      mockData = {
        id: '1',
        type: type || '多选题',
        content: '这是一道测试题目，请选择正确的答案。',
        options: [
          { value: 'A', text: '选项1' },
          { value: 'B', text: '选项2' },
          { value: 'C', text: '选项3' },
          { value: 'D', text: '选项4' }
        ]
      };
    }
    
    // 更新题目数据
    questionType.value = mockData.type;
    questionContent.value = mockData.content;
    options.value = mockData.options;
    
    // 重置选择状态
    selectedOption.value = null;
    selectedOptions.value = [];
    fillBlankAnswers.value = [];
    isNextBtnDisabled.value = true;
    
    return mockData;
  } catch (error) {
    console.error('获取题目失败:', error);
    throw error;
  } finally {
    isLoading.value = false;
  }
};

// 处理选项选择（单选）
const handleOptionChange = (option: string) => {
  selectedOption.value = option;
  isNextBtnDisabled.value = false;
};

// 处理选项选择（多选）
const handleCheckboxChange = (value: (string | number | boolean)[]) => {
  selectedOptions.value = value as string[];
  isNextBtnDisabled.value = value.length === 0;
};

// 处理填空题输入
const handleFillBlankChange = (index: number, value: string) => {
  // 确保数组长度足够
  while (fillBlankAnswers.value.length <= index) {
    fillBlankAnswers.value.push('');
  }
  // 更新对应索引的答案
  fillBlankAnswers.value[index] = value;
  // 检查是否所有空白处都已填写
  const allFilled = fillBlankAnswers.value.every(answer => answer.trim().length > 0);
  isNextBtnDisabled.value = !allFilled;
};

// 处理填空题内容，将空白处替换为输入框
const processFillBlankContent = (content: string) => {
  return content.split('______');
};

// 处理下一题点击
const handleNextClick = async () => {
  try {
    // TODO: 这里可以添加提交答案的逻辑
    // await submitAnswer({ questionId, answer: selectedOption.value || selectedOptions.value });
    
    // 获取下一道题目
    await fetchQuestion(questionType.value);
  } catch (error) {
    console.error('切换题目失败:', error);
  }
};

// 生命周期钩子
onMounted(async () => {
  // 组件挂载后加载第一道题目（测试填空题）
  await fetchQuestion('填空题');
});
</script>

<template>
  <div class="quiz-card">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-text">加载中...</div>
    </div>

    <!-- 题目内容 -->
    <template v-else>
      <!-- 题目区域 -->
      <div class="question-container">
        <div class="question-title">{{ questionType }}</div>
        <div v-if="questionType != '填空题'" class="question-content">{{ questionContent }}</div>
      </div>

      <!-- 单选题选项区域 -->
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

      <!-- 判断题选项区域 -->
      <div v-if="questionType == '判断题'" class="options-container">
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
            <span class="radio-letter">{{ option.value === 'true' ? '√' : '×' }}</span>
          </label>
          <span class="option-text">{{ option.text }}</span>
        </div>
      </div>

      <!-- 填空题选项区域 -->
      <div v-if="questionType == '填空题'" class="options-container">
        <div class="fill-blank-content">
          <template v-for="(part, index) in processFillBlankContent(questionContent)" :key="index">
            <span v-if="index < processFillBlankContent(questionContent).length - 1">
              {{ part }}
              <input 
                v-model="fillBlankAnswers[index]" 
                class="inline-fill-blank-input"
                placeholder="请填写"
                @input="handleFillBlankChange(index, fillBlankAnswers[index])"
              >
            </span>
            <span v-else>{{ part }}</span>
          </template>
        </div>
      </div>

      <!-- 多选题选项区域 -->
      <div v-if="questionType == '多选题'" class="options-container">
        <el-checkbox-group v-model="selectedOptions" @change="handleCheckboxChange">
          <div class="option-item" v-for="option in options" :key="option.value">
            <el-checkbox :label="option.value" class="custom-checkbox">
              <span class="checkbox-letter">{{ option.value }}</span>
              <span class="option-text">{{ option.text }}</span>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>

      <!-- 下一题按钮 -->
      <el-button 
        class="next-btn" 
        :disabled="isNextBtnDisabled"
        @click="handleNextClick"
        type="primary"
      >
        下一题
      </el-button>
    </template>
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
  min-height: 300px;
}

/* 加载状态容器 */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.loading-text {
  font-size: 16px;
  color: #999;
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

/* 多选题样式 */
.custom-checkbox {
  display: flex;
  align-items: center;
  width: 100%;
}

.custom-checkbox :deep(.el-checkbox__label) {
  display: flex;
  align-items: center;
  padding-left: 8px;
}

.checkbox-letter {
  font-size: 16px;
  font-weight: bold;
  color: #666;
  margin-right: 12px;
}

/* 最后一个选项去掉下边距 */
.option-item:last-child {
  margin-bottom: 0;
}

/* 填空题样式 */
.fill-blank-content {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
}

.inline-fill-blank-input {
  display: inline-block;
  width: 120px;
  margin: 0 8px;
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 16px;
  font-family: "Microsoft Yahei", sans-serif;
  transition: border-color 0.3s ease;
}

.inline-fill-blank-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.inline-fill-blank-input::placeholder {
  color: #999;
  font-size: 14px;
}

/* 下一题按钮样式 */
.next-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  cursor: pointer;
}

.next-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.next-btn:disabled {
  cursor: not-allowed;
}
</style>