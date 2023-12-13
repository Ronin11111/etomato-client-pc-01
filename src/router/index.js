import {
  createRouter,
  createWebHashHistory
} from 'vue-router'

const routes = [{
  path: '/',
  component: () => import('@/views/Layout'),
  children: [
    { path: '/', component: () => import('@/views/Home/index') },
    { path: '/category/:id', component: () => import('@/views/Category/index') },
    { path: '/category/sub/:id', component: () => import('@/views/Category/subCate') }
  ]
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
