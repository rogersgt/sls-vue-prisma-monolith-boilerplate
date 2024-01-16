import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import useUserStore from '@/stores/user.store'
import type { AxiosError } from 'axios'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (Login.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/band/:bandId',
      name: 'band',
      component: () => import('../views/BandView.vue')
    }
  ]
})

router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore();
  if (to.name !== 'login') {
    await userStore.fetchLoggedInUser()
      .catch((e: AxiosError) => {
        if (e.response?.status === 401) {
          router.push({ name: 'login' })
        }
      })
  }
  next()
})

export default router
