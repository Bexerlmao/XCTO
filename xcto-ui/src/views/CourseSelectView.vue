<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getCourseList } from '@/api/course'
import type { Course } from '@/types/api'

const router = useRouter()

const courses = ref<Course[]>([])
const loading = ref(false)
const searchKeyword = ref('')

const fetchCourses = async () => {
  loading.value = true
  try {
    courses.value = await getCourseList()
  } catch {
    ElMessage.error('获取课程列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // 客户端按 classId 过滤
  if (searchKeyword.value) {
    fetchCourses().then(() => {
      courses.value = courses.value.filter((c) =>
        String(c.classId).includes(searchKeyword.value),
      )
    })
  } else {
    fetchCourses()
  }
}

const handleEnterCourse = (course: Course) => {
  router.push({ name: 'question', query: { classId: course.classId } })
}

onMounted(() => {
  fetchCourses()
})
</script>

<template>
  <div class="course-select-container">
    <!-- 头部区域 -->
    <div class="header">
      <h1 class="title">选择课程</h1>
      <p class="subtitle">选择一个课程开始刷题</p>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="输入课程名称搜索..."
        clearable
        size="large"
        class="search-input"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <span style="color: #a8abb2">🔍</span>
        </template>
      </el-input>
      <el-button
        type="primary"
        size="large"
        @click="handleSearch"
      >
        搜索
      </el-button>
    </div>

    <!-- 课程卡片列表 -->
    <div v-loading="loading" class="course-list">
      <el-empty v-if="!loading && courses.length === 0" description="暂无课程数据" />

      <div v-else class="course-grid">
        <div
          v-for="(course, index) in courses"
          :key="course.id"
          class="course-card"
          @click="handleEnterCourse(course)"
        >
          <div class="course-cover" :class="`cover-color-${index % 6}`">
            <span class="cover-text">班级 {{ course.classId }}</span>
            <span class="cover-count">{{ course.questionTotal }} 题</span>
          </div>
          <div class="course-footer">
            <span class="course-desc">classId: {{ course.classId }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.course-select-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 16px;
}

.header {
  text-align: center;
  margin-bottom: 28px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 6px 0;
}

.subtitle {
  font-size: 13px;
  color: #909399;
  margin: 0;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
}

.search-input {
  max-width: 400px;
}

/* 课程列表 */
.course-list {
  min-height: 200px;
}

/* 课程网格 */
.course-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

@media (max-width: 1100px) {
  .course-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 860px) {
  .course-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 580px) {
  .course-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 课程卡片 */
.course-card {
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.course-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.13);
}

/* 卡片封面 */
.course-cover {
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  position: relative;
}

.cover-text {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  padding: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.cover-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
}

/* 6种配色轮换 */
.cover-color-0 { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.cover-color-1 { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.cover-color-2 { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.cover-color-3 { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); }
.cover-color-4 { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.cover-color-5 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }

/* 卡片底部信息 */
.course-footer {
  padding: 8px 10px;
  text-align: center;
}

.course-desc {
  font-size: 12px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
