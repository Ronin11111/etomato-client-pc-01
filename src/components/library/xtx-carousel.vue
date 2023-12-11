<template>
  <!-- 全局轮播图组件 -->
  <div class="xtx-carousel" @mouseenter="startFn" @mouseleave="closeFn">
    <ul class="carousel-body">
      <li
        class="carousel-item"
        v-for="(item, index) in list"
        :key="index"
        :class="{ fade: index === ind }"
      >
        <RouterLink to="/">
          <img :src="item.imgUrl" alt="" />
        </RouterLink>
      </li>
    </ul>
    <a href="javascript:;" @click="triggle(-1)" class="carousel-btn prev"
      ><i class="iconfont icon-angle-left"></i
    ></a>
    <a href="javascript:;" @click="triggle(+1)" class="carousel-btn next"
      ><i class="iconfont icon-angle-right"></i
    ></a>
    <div class="carousel-indicator">
      <span
        v-for="(sub, index) in list"
        :key="index"
        @click="ind = index"
        :class="{ active: index === ind }"
      ></span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    },
    // 是否自动播放
    autoPaly: {
      type: Boolean,
      default: false
    },
    // 间隔时长
    duration: {
      type: Number,
      default: 3000
    }
  },
  setup (props) {
    // 定义轮播的图片
    const ind = ref(0)

    // 1.设置自动播放
    let timer = null
    const playFn = () => {
      // ①在每次设置定时器前，先清空定时器=》避免重复设置
      clearInterval(timer)
      timer = setInterval(() => {
        ind.value++
        if (ind.value >= props.list.length) {
          ind.value = 0
        }
      }, props.duration)
    }

    // 2.设置自动播放条件
    watch(() => props.list, (newVal) => {
      if (newVal.length && props.autoPaly === true) {
        playFn()
      }
    }, { immediate: true })

    // 3.1.鼠标移入时，关闭自动播放
    const startFn = () => {
      if (timer) clearInterval(timer)
    }

    // 3.2.鼠标移出时，开启自动播放
    const closeFn = () => {
      if (props.list.length && props.autoPaly === true) { playFn() }
    }

    // 4.点击点点，切换至对应图片

    // 5.点击按钮，实现上下图片切换
    const triggle = (step) => {
      const newInd = ind.value + step
      if (newInd > props.list.length - 1) {
        ind.value = 0
        return
      } else if (newInd < 0) {
        ind.value = props.list.length - 1
        return
      }
      ind.value = newInd
    }
    // 6.销毁组件，将定时器清空
    onUnmounted(() => {
      clearInterval(timer)
    })
    return { ind, startFn, closeFn, triggle }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
