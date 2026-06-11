<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElCheckbox, ElCheckboxGroup, ElButton } from 'element-plus'
import { getRandomQuestion, checkAnswer } from '@/api/question'
import type { QuestionOption } from '@/types/api'

const route = useRoute()

const classId = Number(route.query.classId)

const questionTypeMap: Record<string, string> = {
  '0': '单选题',
  '1': '多选题',
  '2': '填空题',
  '3': '判断题',
}

const getQuestionTypeText = (type: string | undefined): string => {
  if (!type) return ''
  return questionTypeMap[type] || type
}

const questionId = ref<number>(0)
const questionType = ref<string>('')
const questionContent = ref('')
const options = ref<QuestionOption[]>([])
const isNextBtnDisabled = ref(true)
const selectedOption = ref<string | null>(null)
const selectedOptions = ref<string[]>([])
const fillBlankAnswers = ref<string[]>([])
const isLoading = ref(false)
const answerState = ref<'answering' | 'correct' | 'wrong'>('answering')
const correctAnswers = ref<string[]>([])
const isChecking = ref(false)

function mapOptions(raw: Record<string, string>): QuestionOption[] {
  return Object.entries(raw).map(([key, text]) => ({
    value: key,
    text,
  }))
}

const fetchQuestion = async () => {
  isLoading.value = true
  try {
    const data = await getRandomQuestion(classId)

    questionId.value = data.id
    questionType.value = String(data.questionType)
    questionContent.value = data.question
    options.value = data.options ? mapOptions(data.options) : []

    selectedOption.value = null
    selectedOptions.value = []
    fillBlankAnswers.value = []
    isNextBtnDisabled.value = true
    answerState.value = 'answering'
    correctAnswers.value = []
  } catch {
    ElMessage.error('获取题目失败')
  } finally {
    isLoading.value = false
  }
}

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
const handleFillBlankChange = (index: number, value: string | undefined) => {
  // 确保数组长度足够
  while (fillBlankAnswers.value.length <= index) {
    fillBlankAnswers.value.push('');
  }
  // 更新对应索引的答案
  fillBlankAnswers.value[index] = value || '';
  // 检查是否所有空白处都已填写
  const allFilled = fillBlankAnswers.value.every(answer => answer.trim().length > 0);
  isNextBtnDisabled.value = !allFilled;
};

// 处理填空题内容，将空白处替换为输入框
const processFillBlankContent = (content: string) => {
  return content.split(/\{(\d+)\}/g);
};

const isBlankMarker = (part: string) => {
  return /^\d+$/.test(part);
};

const getPlaceholder = (blankIndex: number): string => {
  const option = options.value.find(o => o.value === String(blankIndex));
  return option?.text || '请填写';
};

const radioMap:Record<string, string> = {
  "0": "A",
  "1": "B",
  "2": "C",
  "3": "D",
  "4": "E",
  "5": "F",
  "6": "G",
  "7": "H",
  "8": "I",
  "9": "J",
  "10": "K",
  "11": "L",
  "12": "M",
  "13": "N",
  "14": "O",
  "15": "P",
  "16": "Q",
  "17": "R",
  "18": "S",
  "19": "T",
  "20": "U",
  "21": "V",
  "22": "W",
  "23": "X",
  "24": "Y",
  "25": "Z"
}

const getQuestionRadio = (radioNumber: string) : string => radioMap[radioNumber]

// 收集用户答案并映射为文本数组发送给后端
const collectAnswers = (): string[] => {
  const type = questionType.value
  if (type === '0' || type === '3') {
    // 单选 / 判断：key → text
    const text = options.value.find(o => o.value === selectedOption.value)?.text
    return text ? [text] : []
  }
  if (type === '1') {
    // 多选：keys → texts
    return selectedOptions.value
      .map(key => options.value.find(o => o.value === key)?.text)
      .filter((t): t is string => !!t)
  }
  if (type === '2') {
    // 填空：已是文本
    return fillBlankAnswers.value.map(a => (a || '').trim())
  }
  return []
}

// 选项 CSS 类（用于单选/多选/判断）
const getOptionClass = (optionValue: string): string => {
  if (answerState.value === 'answering') return ''
  const optionText = options.value.find(o => o.value === optionValue)?.text
  if (!optionText) return ''
  const isCorrect = correctAnswers.value.includes(optionText)
  if (isCorrect) return 'option-correct'
  const isSelected =
    questionType.value === '1'
      ? selectedOptions.value.includes(optionValue)
      : selectedOption.value === optionValue
  if (isSelected && !isCorrect) return 'option-wrong'
  return ''
}

// 填空输入框 CSS 类
const getFillBlankClass = (index: number): string => {
  if (answerState.value === 'answering') return ''
  const userAnswer = (fillBlankAnswers.value[index] || '').trim()
  const correctAnswer = correctAnswers.value[index] || ''
  if (!userAnswer) return ''
  return userAnswer === correctAnswer ? 'fill-input-correct' : 'fill-input-wrong'
}

// 处理下一题点击
const handleNextClick = async () => {
  // 错误状态下点击 → 直接跳到下一题
  if (answerState.value === 'wrong') {
    await fetchQuestion()
    return
  }

  // 正在检查中 → 忽略重复点击
  if (isChecking.value) return

  // 收集答案并检查
  const userAnswers = collectAnswers()
  isChecking.value = true
  try {
    const result = await checkAnswer(questionId.value, userAnswers)
    if (result.correct) {
      answerState.value = 'correct'
      setTimeout(() => {
        fetchQuestion()
      }, 1000)
    } else {
      answerState.value = 'wrong'
      correctAnswers.value = result.correctAnswers
    }
  } catch {
    ElMessage.error('检查答案失败')
  } finally {
    isChecking.value = false
  }
};

// 生命周期钩子
onMounted(async () => {
  if (!classId) {
    ElMessage.error('缺少班级ID参数')
    return
  }
  await fetchQuestion()
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
        <div class="question-title">{{ getQuestionTypeText(questionType) }}</div>
        <div v-if="questionType != '2'" class="question-content">{{ questionContent }}</div>
      </div>

      <!-- 单选题选项区域 -->
      <div v-if="questionType == '0'" class="options-container">
        <div class="option-item" v-for="option in options" :key="option.value" :class="getOptionClass(option.value)">
          <input
            type="radio"
            :name="'option'"
            :id="`option${option.value}`"
            class="option-input"
            :checked="selectedOption === option.value"
            :disabled="answerState !== 'answering'"
            @change="handleOptionChange(option.value)"
          >
          <label :for="`option${option.value}`" class="custom-radio">
            <span class="radio-letter">{{ getQuestionRadio(option.value)}}</span>
          </label>
          <span class="option-text">{{ option.text }}</span>
        </div>
      </div>

      <!-- 判断题选项区域 -->
      <div v-if="questionType == '3'" class="options-container">
        <div class="option-item" v-for="option in options" :key="option.value" :class="getOptionClass(option.value)">
          <input
            type="radio"
            :name="'option'"
            :id="`option${option.value}`"
            class="option-input"
            :checked="selectedOption === option.value"
            :disabled="answerState !== 'answering'"
            @change="handleOptionChange(option.value)"
          >
          <label :for="`option${option.value}`" class="custom-radio">
            <span class="radio-letter">{{ option.value === '0' ? '√' : '×' }}</span>
          </label>
          <span class="option-text">{{ option.text }}</span>
        </div>
      </div>

      <!-- 填空题选项区域 -->
      <div v-if="questionType == '2'" class="options-container">
        <div class="fill-blank-content">
          <template v-for="(part, index) in processFillBlankContent(questionContent)" :key="index">
            <template v-if="isBlankMarker(part)">
              <span class="inline-fill-blank-wrapper">
                <input
                  v-model="fillBlankAnswers[Number(part)]"
                  class="inline-fill-blank-input"
                  :class="getFillBlankClass(Number(part))"
                  :placeholder="getPlaceholder(Number(part))"
                  :disabled="answerState !== 'answering'"
                  @input="handleFillBlankChange(Number(part), fillBlankAnswers[Number(part)])"
                >
                <span v-if="answerState === 'wrong' && correctAnswers[Number(part)]" class="correct-answer-hint">
                  正确答案：{{ correctAnswers[Number(part)] }}
                </span>
              </span>
            </template>
            <span v-else>{{ part }}</span>
          </template>
        </div>
      </div>

      <!-- 多选题选项区域 -->
      <div v-if="questionType == '1'" class="options-container">
        <el-checkbox-group v-model="selectedOptions" @change="handleCheckboxChange" :disabled="answerState !== 'answering'">
          <div class="option-item" v-for="option in options" :key="option.value" :class="getOptionClass(option.value)">
            <el-checkbox :label="option.value" class="custom-checkbox">
              <span class="checkbox-letter">{{ getQuestionRadio(option.value) }}</span>
              <span class="option-text">{{ option.text }}</span>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>

      <!-- 下一题按钮 -->
      <el-button
        class="next-btn"
        :class="{
          'btn-correct': answerState === 'correct',
          'btn-wrong': answerState === 'wrong'
        }"
        :disabled="isNextBtnDisabled || isChecking || answerState === 'correct'"
        :loading="isChecking"
        @click="handleNextClick"
        :type="answerState === 'correct' ? 'success' : answerState === 'wrong' ? 'danger' : 'primary'"
      >
        <template v-if="answerState === 'correct'">✓ 正确</template>
        <template v-else-if="answerState === 'wrong'">✗ 错误，点击继续</template>
        <template v-else>下一题</template>
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

/* 答题反馈 — 正确的选项高亮 */
.option-item.option-correct {
  border-radius: 8px;
  padding: 8px;
  margin-left: -8px;
  background: #f0f9eb;
  border: 1px solid #67c23a;
}

/* 答题反馈 — 用户选错的选项高亮 */
.option-item.option-wrong {
  border-radius: 8px;
  padding: 8px;
  margin-left: -8px;
  background: #fef0f0;
  border: 1px solid #f56c6c;
}

/* 填空输入框正确/错误状态 */
.inline-fill-blank-input.fill-input-correct {
  border-color: #67c23a !important;
  background: #f0f9eb;
}

.inline-fill-blank-input.fill-input-wrong {
  border-color: #f56c6c !important;
  background: #fef0f0;
}

/* 填空包装器 */
.inline-fill-blank-wrapper {
  display: inline-flex;
  flex-direction: column;
  vertical-align: middle;
}

/* 正确答案提示 */
.correct-answer-hint {
  font-size: 12px;
  color: #67c23a;
  margin-top: 2px;
}

/* 按钮正确/错误状态 */
.next-btn.btn-correct {
  --el-button-bg-color: #67c23a;
  --el-button-border-color: #67c23a;
}

.next-btn.btn-wrong {
  --el-button-bg-color: #f56c6c;
  --el-button-border-color: #f56c6c;
}
</style>