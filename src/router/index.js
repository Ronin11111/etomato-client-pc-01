import {
  createRouter,
  createWebHashHistory
} from 'vue-router'

const routes = [{
  path: '/',
  component: () => import('@/views/Layout'),
  children: [{
    path: '/',
    component: () => import('@/views/Home')
  },
  {
    path: '/category/:id',
    component: () => import('@/views/Category/index.vue')
  },
  {
    path: '/category/sub/:id',
    component: () => import('@/views/Category/subCate.vue')
  }
  ]
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
