import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import store from '@/store'

const routes = [{
  path: '/',
  component: () => import('@/views/Layout'),
  children: [
    { path: '/', component: () => import('@/views/Home/index') },
    { path: '/category/:id', component: () => import('@/views/Category/index') },
    { path: '/category/sub/:id', component: () => import('@/views/Category/subCate') },
    { path: '/product/:id', component: () => import('@/views/Goods/index') },
    { path: '/cart', component: () => import('@/views/Cart/index') },
    { path: '/member/checkout', component: () => import('@/views/member/pay/checkOut') }
  ]
},
{
  path: '/login',
  component: () => import('@/views/Login')
},
{
  path: '/login/callback',
  component: () => import('@/views/Login/callback.vue')
}

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 跳转路由时，页面滚动至相应位置
  scrollBehavior () {
    return { left: 0, top: 0 }
  }
})

// 前置导航守卫
router.beforeEach((to, from, next) => {
  const { profile } = store.state.user
  // 跳转去member开头的地址却没有登录
  if (to.path.startsWith('/member') && !profile.token) {
    next({ path: '/login', query: { redirectUrl: to.fullPath } })
  }
  next()
})

export default router
