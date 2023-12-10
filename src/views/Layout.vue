<template>
  <div>
    <!-- 头部 -->
    <top-nav></top-nav>
    <!-- 头部导航栏 -->
    <app-header></app-header>
    <!-- 吸顶导航栏 -->
    <!-- 注意：吸顶导航栏要在头部导航栏下（避免后来居上） -->
    <header-sticky></header-sticky>
    <!-- 首页 -->
    <Home></Home>
    <!-- 底部 -->
    <app-footer></app-footer>
  </div>
</template>

<script>
import TopNav from '@/components/topNav.vue'
import AppHeader from '@/components/header.vue'
import AppFooter from '@/components/footer.vue'
import HeaderSticky from '@/components/header-sticky.vue'
import Home from '@/views/Home'
import { useStore } from 'vuex'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Layout',
  components: {
    TopNav,
    AppHeader,
    AppFooter,
    HeaderSticky,
    Home
  },
  setup () {
    // 注意：调用接口在整体的layout组件中加载
    const store = useStore()
    store.dispatch('category/getList')
  }
}</script>

<style lang="less" scoped>
.main{
  min-height: 300px;
}
</style>
