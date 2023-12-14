<template>
  <div class="sub-cate">
    <div class="container">
      <!-- 面包屑组件 -->
      <CateBread></CateBread>
      <!-- 筛选区域 -->
      <SubFilter></SubFilter>
    </div>
  </div>
</template>

<script>
import CateBread from './components/cate-bread.vue'
import SubFilter from './components/sub-filter.vue'
export default {
  name: 'SubCategory',
  components: {
    CateBread,
    SubFilter
  },
  setup () {}
}
</script>

<style>
</style>
