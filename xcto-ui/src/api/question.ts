import request from './request'
import type { CheckResult, Question } from '@/types/api'

/** 随机获取一道题目 */
export function getRandomQuestion(classId: number): Promise<Question> {
  return request.get<Question>(`/question/${classId}`).then((res) => res.data)
}

/** 检查题目答案 */
export function checkAnswer(questionId: number, answers: string[]): Promise<CheckResult> {
  return request.post<CheckResult>(`/question/check/${questionId}`, answers).then((res) => res.data)
}
