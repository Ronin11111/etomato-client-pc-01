<template>
  <div>
    <top-nav></top-nav>
    <app-header></app-header>
    <nav>底部通栏</nav>
    <div><router-view></router-view></div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import TopNav from '@/components/topNav.vue'
import AppHeader from '@/components/header.vue'
import AppFooter from '@/components/footer.vue'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Layout',
  components: {
    TopNav,
    AppHeader,
    AppFooter
  }
}
</script>

<style lang="less" scoped>
</style>
