<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Course {
  id: number
  classId: number
  name: string
  description: string
  questionTotal: number
  cover?: string
}

const courses = ref<Course[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(0)

// TODO: 替换为实际的 API 调用
const fetchCourses = async () => {
  loading.value = true
  try {
    // const response = await fetch('/api/courses', {
    //   method: 'GET',
    // })
    // const data = await response.json()
    // courses.value = data.records
    // total.value = data.total

    // 硬编码课程数据
    courses.value = [
      { id: 1, classId: 1001, name: '高等数学', description: '微积分、线性代数与概率统计基础', questionTotal: 120 },
      { id: 2, classId: 1002, name: '大学英语', description: '英语听说读写综合能力训练', questionTotal: 85 },
      { id: 3, classId: 1003, name: '数据结构与算法', description: '常见数据结构与经典算法分析', questionTotal: 200 },
      { id: 4, classId: 1004, name: '计算机网络', description: 'TCP/IP协议栈与网络通信原理', questionTotal: 150 },
      { id: 5, classId: 1005, name: '马克思主义原理', description: '马克思主义哲学、政治经济学与科学社会主义', questionTotal: 98 },
      { id: 6, classId: 1006, name: '操作系统', description: '进程管理、内存管理与文件系统', questionTotal: 175 },
      { id: 7, classId: 1007, name: '数据库原理', description: '关系型数据库设计与SQL应用', questionTotal: 130 },
      { id: 8, classId: 1008, name: '软件工程', description: '软件开发流程、设计模式与项目管理', questionTotal: 110 },
    ]
    total.value = 8
  } catch (error) {
    ElMessage.error('获取课程列表失败')
    console.error('获取课程列表失败:', error)
  } finally {
    loading.value = false
  }
}

// TODO: 替换为实际的搜索 API 调用
const handleSearch = async () => {
  loading.value = true
  try {
    // const response = await fetch(`/api/courses/search?keyword=${searchKeyword.value}&page=${currentPage.value}&size=${pageSize.value}`)
    // const data = await response.json()
    // courses.value = data.records
    // total.value = data.total

    console.log('搜索关键词:', searchKeyword.value)
  } catch (error) {
    ElMessage.error('搜索失败')
    console.error('搜索失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchCourses()
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
            <span class="cover-text">{{ course.name }}</span>
            <span class="cover-count">{{ course.questionTotal }} 题</span>
          </div>
          <div class="course-footer">
            <span class="course-desc">{{ course.description }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="total > pageSize" class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        background
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
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

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}
</style>
