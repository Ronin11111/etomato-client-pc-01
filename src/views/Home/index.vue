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
      <!-- 热门品牌 -->
      <HomeHotBrand></HomeHotBrand>
    </div>
  </div>
</template>

<script>
import HomeCategory from '@/views/Home/components/home-category.vue'
import HomeBanner from '@/views/Home/components/home-carousel.vue'
import HomeFresh from '@/views/Home/components/home-fresh.vue'
import HomeHot from '@/views/Home/components/home-hot.vue'
import HomeHotBrand from '@/views/Home/components/home-hotbrand.vue'

export default {
  name: 'home-page',
  components: {
    HomeCategory,
    HomeBanner,
    HomeFresh,
    HomeHot,
    HomeHotBrand
  }
}
</script>

<style>

</style>
