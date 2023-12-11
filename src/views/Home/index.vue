<template>
  <!-- 首页 -->
  <div class="home-entry">
    <div class="container">
      <!-- 左侧分类 -->
      <HomeCategory />
      <!-- 轮播图 -->
      <HomeBanner />
    </div>
  </div>
</template>

<script>
import HomeCategory from '@/views/Home/components/home-category.vue'
import HomeBanner from '@/views/Home/components/home-carousel.vue'

export default {
  name: 'home-page',
  components: {
    HomeCategory,
    HomeBanner
  }
}
</script>

<style>
</style>
