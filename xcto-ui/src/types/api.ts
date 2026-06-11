/** 后端返回的题目结构 */
export interface Question {
  id: number
  classId: number
  questionType: number
  question: string
  options: Record<string, string>
}

/** 前端使用的选项格式 */
export interface QuestionOption {
  value: string
  text: string
}

/** 班级信息 */
export interface Course {
  id: number
  classId: number
  questionTotal: number
}
