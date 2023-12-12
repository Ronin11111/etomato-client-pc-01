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
      <!-- 商品区块 -->
      <HomeProduct></HomeProduct>
      <!-- 最新区块 -->
      <HomeSpecial></HomeSpecial>
    </div>
  </div>
</template>

<script>
import HomeCategory from '@/views/Home/components/home-category.vue'
import HomeBanner from '@/views/Home/components/home-carousel.vue'
import HomeFresh from '@/views/Home/components/home-fresh.vue'
import HomeHot from '@/views/Home/components/home-hot.vue'
import HomeProduct from '@/views/Home/components/home-product.vue'
import HomeHotBrand from '@/views/Home/components/home-hotbrand.vue'
import HomeSpecial from '@/views/Home/components/home-special.vue'

export default {
  name: 'home-page',
  components: {
    HomeCategory,
    HomeBanner,
    HomeFresh,
    HomeHot,
    HomeHotBrand,
    HomeProduct,
    HomeSpecial
  }
}
</script>

<style>

</style>
