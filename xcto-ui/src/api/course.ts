import request from './request'
import type { Course } from '@/types/api'

/** 获取所有班级列表 */
export function getCourseList(): Promise<Course[]> {
  return request.get<Course[]>('/chaoxingClass/list').then((res) => res.data)
}
