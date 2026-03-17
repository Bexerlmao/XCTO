import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import QuestionView from "@/views/QuestionView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
    {
      path: '/',
      name: 'home',
      component: QuestionView,
    },
    {
      path: '/question',
      name: 'question',
      component: QuestionView,
    },
  ]
})

export default router
