import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import QuestionView from "@/views/QuestionView.vue";
import CourseSelectView from "@/views/CourseSelectView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
    {
      path: '/',
      name: 'home',
      component: CourseSelectView,
    },
    {
      path: '/courses',
      name: 'courses',
      component: CourseSelectView,
    },
    {
      path: '/question',
      name: 'question',
      component: QuestionView,
    },
  ]
})

export default router
