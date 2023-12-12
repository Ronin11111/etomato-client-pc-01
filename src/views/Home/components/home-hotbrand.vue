<template>
  <div class="home-hot-brand">
    <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
      <template #right>
        <a
          href="javascript:;"
          @click="triggle(-1)"
          class="iconfont icon-angle-left prev"
          :class="{ disabled: index === 0 }"
        ></a>
        <a
          href="javascript:;"
          @click="triggle(1)"
          class="iconfont icon-angle-right next"
          :class="{ disabled: index === 1 }"
        ></a>
      </template>
      <div class="box" ref="target">
        <Transition>
          <ul
            v-if="brands.length"
            class="list"
            :style="{ transform: `translateX(${-index * 1240}px)` }"
          >
            <li v-for="item in brands" :key="item.id">
              <RouterLink to="/">
                <img :src="item.picture" alt="" />
              </RouterLink>
            </li>
          </ul>
          <div v-else class="skeleton">
            <XtxSkeleton
              class="item"
              v-for="i in 5"
              :key="i"
              animated
              bg="#e4e4e4"
              width="240px"
              height="305px"
            />
          </div>
        </Transition>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from './home-panel.vue'
import XtxSkeleton from '@/components/library/xtx-skeleton.vue'
import { getBrand } from '@/api/home.js'
import { lazyData } from '@/hock/main.js'
import { ref } from 'vue'

export default {
  name: 'HomeHotBrand',
  components: {
    HomePanel,
    XtxSkeleton
  },
  setup () {
    // ！！！注意：懒加载函数传参：必须写成函数效果=>不可为getBrand(x)=》函数调用，其为promise对象
    const { result, target } = lazyData(() => getBrand(10))
    const index = ref(0)
    // 滚动切换效果
    const triggle = (step) => {
      const newVal = index.value + step
      if (newVal > 1 || newVal < 0) {
        return
      }
      index.value = newVal
    }
    return { brands: result, target, index, triggle }
  }
}
</script>

<style scoped lang='less'>
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
.skeleton {
  width: 100%;
  display: flex;
  .item {
    margin-right: 10px;
    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}
</style>
