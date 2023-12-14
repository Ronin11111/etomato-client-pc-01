<template>
  <div class="sub-cate">
    <div class="container">
      <!-- 面包屑组件 -->
      <CateBread></CateBread>
    </div>
  </div>
</template>

<script>
import CateBread from './components/cate-bread.vue'
export default {
  name: 'SubCategory',
  components: {
    CateBread
  },
  setup () {}
}
</script>

<style>
</style>
