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
  routes,
  // 跳转路由时，页面滚动至相应位置
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

export default router
