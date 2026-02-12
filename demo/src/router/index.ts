import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/basic'
  },
  {
    path: '/basic',
    component: () => import('../views/BasicView.vue'),
    meta: { title: 'Basic Usage' }
  },
  {
    path: '/search',
    component: () => import('../views/SearchView.vue'),
    meta: { title: 'With Search' }
  },
  {
    path: '/actions',
    component: () => import('../views/ActionsView.vue'),
    meta: { title: 'With Actions' }
  },
  {
    path: '/api',
    component: () => import('../views/ApiView.vue'),
    meta: { title: 'Real World API' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'Demo'} - Element Plus X`
  next()
})

export default router
