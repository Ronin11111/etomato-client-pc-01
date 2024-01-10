<template>
  <div ref="target" class="home-hot">
    <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
      <div style="position: relative; height: 426px">
        <Transition class="fade">
          <ul v-if="goods.length" ref="pannel" class="goods-list">
            <li v-for="item in goods" :key="item.id">
              <RouterLink to="`/product/${goods.id}`">
                <img :src="item.picture" alt="" />
                <p class="name">{{ item.title }}</p>
                <p class="desc">{{ item.alt }}</p>
              </RouterLink>
            </li>
          </ul>
          <HomeSkeleton bg="#f0f9f4" v-else></HomeSkeleton>
        </Transition>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from './home-panel.vue'
import HomeSkeleton from './home-skeleton.vue'
import { getHot } from '@/api/home.js'
import { lazyData } from '@/hock/main.js'

export default {
  name: 'HomeHot',
  components: {
    HomePanel,
    HomeSkeleton
  },
  setup () {
    const { result, target } = lazyData(getHot)
    return { goods: result, target }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
