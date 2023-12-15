<template>
  <div class="goods-image">
    <!-- 大图（放大图) -->
    <div
      v-show="show"
      class="large"
      :style="[
        { backgroundImage: `url(${images[currIndex]})` },backgroundPosition,
      ]"
    ></div>
    <!-- 中图 -->
    <div class="middle" ref="target">
      <img :src="images[currIndex]" alt="" />
      <!-- 遮罩层 -->
      <div v-show="show" class="layer" :style="position"></div>
    </div>
    <!-- 小图 -->
    <ul class="small">
      <li
        v-for="(img, i) in images"
        :key="img"
        :class="{ active: i === currIndex }"
      >
        <img @mouseenter="currIndex = i" :src="img" alt="" />
      </li>
    </ul>
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'

export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const currIndex = ref(0)
    // 遮罩层，大图显示/隐藏
    const show = ref(false)
    // 遮罩层位置
    const position = reactive({ top: 0, left: 0 })
    // 大图背景位置
    const backgroundPosition = reactive({
      backgroundPositionX: 0,
      backgroundPositionY: 0
    })
    // 目标元素
    const target = ref(null)
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    watch([elementX, elementY, isOutside], () => {
      // 判断X轴
      if (elementX.value < 100) {
        position.left = 0
      } else if (elementX.value > 300) {
        position.left = 200
      } else {
        position.left = elementX.value - 100
      }
      // 判断Y轴
      if (elementY.value < 100) {
        position.top = 0
      } else if (elementY.value > 300) {
        position.top = 200
      } else {
        position.top = elementY.value - 100
      }
      backgroundPosition.backgroundPositionX = -position.left * 2 + 'px'
      backgroundPosition.backgroundPositionY = -position.top * 2 + 'px'
      position.left = position.left + 'px'
      position.top = position.top + 'px'
      show.value = !isOutside.value
    })
    return { currIndex, position, backgroundPosition, show, target }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
