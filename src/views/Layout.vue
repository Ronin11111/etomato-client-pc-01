<template>
  <div>
    <!-- 头部 -->
    <top-nav></top-nav>
    <!-- 头部导航栏 -->
    <app-header></app-header>
    <!-- 吸顶导航栏 -->
    <!-- 注意：吸顶导航栏要在头部导航栏下（避免后来居上） -->
    <header-sticky></header-sticky>
    <!-- 内容区域 -->
    <div class="main">
      <!-- 二级路由 -->
      <RouterView />
    </div>
    <!-- 底部 -->
    <app-footer></app-footer>
  </div>
</template>

<script>
import TopNav from '@/components/topNav.vue'
import AppHeader from '@/components/header.vue'
import AppFooter from '@/components/footer.vue'
import HeaderSticky from '@/components/header-sticky.vue'
import { useStore } from 'vuex'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Layout',
  components: {
    TopNav,
    AppHeader,
    AppFooter,
    HeaderSticky
  },
  setup () {
    // 注意：调用接口在整体的layout组件中加载
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style lang="less" scoped>
.main {
  min-height: 300px;
}
</style>
