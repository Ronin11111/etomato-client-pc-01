<template>
  <!-- 首页轮播图组件 -->
  <div class="home-banner">
    <XtxCarousel :list="imgList" autoPaly/>
  </div>
</template>
<script>
import { ref } from 'vue'
import { getBanner } from '@/api/home'

export default {
  name: 'HomeBanner',
  setup () {
    const imgList = ref([])
    // 注意：发起异步请求，使用Promise
    getBanner().then((data) => {
      imgList.value = data.result
    })
    return { imgList }
  }
}
</script>
<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98
}
.xtx-carousel {
  ::v-deep .carousel-btn.prev {
    left: 270px;
  }
  ::v-deep .carousel-indicator {
    padding-left: 250px;
  }
}
</style>
