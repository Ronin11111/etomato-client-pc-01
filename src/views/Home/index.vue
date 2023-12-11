<template>
  <!-- 首页 -->
  <div class="home-entry">
    <div class="container">
      <!-- 左侧分类 -->
      <HomeCategory />
      <!-- 轮播图 -->
      <HomeBanner />
      <!-- 新鲜好物 -->
      <HomeFresh/>
      <!-- 热门好物 -->
      <HomeHot></HomeHot>
    </div>
  </div>
</template>

<script>
import HomeCategory from '@/views/Home/components/home-category.vue'
import HomeBanner from '@/views/Home/components/home-carousel.vue'
import HomeFresh from '@/views/Home/components/home-fresh.vue'
import HomeHot from '@/views/Home/components/home-hot.vue'

export default {
  name: 'home-page',
  components: {
    HomeCategory,
    HomeBanner,
    HomeFresh,
    HomeHot
  }
}
</script>

<style>

</style>
