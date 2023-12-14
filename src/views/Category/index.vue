<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <Transition name="fade-item" mode="out-in">
          <XtxBreadItem :key="cateList.id">{{ cateList.name }}</XtxBreadItem>
        </Transition>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :list="sliders" autoPaly style="height:500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in cateList.children" :key="item.id">
            <a href="javascript:;">
              <img :src="item.picture">
            </a>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
      <div class="ref-goods" v-for="item in goodsList" :key="item.id">
        <div class="head">
          <h3>- {{item.name}} -</h3>
          <p class="tag">{{item.desc}}</p>
          <XtxMore />
        </div>
        <div class="body">
          <GoodsItem v-for="g in item.goods" :key="g.id" :goods="g" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import XtxCarousel from '@/components/library/xtx-carousel.vue'
import { computed, ref, watch } from 'vue'
import { getBanner } from '@/api/home'
import { getTopCategory } from '@/api/category'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import GoodsItem from './components/cate-goodsItem.vue'

export default {
  name: 'TopCategory',
  components: {
    XtxCarousel,
    GoodsItem
  },
  setup () {
    const sliders = ref([])
    getBanner().then((data) => {
      sliders.value = data.result
    })
    // 依据路由参数，从vuex中获取数据
    const store = useStore()
    const route = useRoute()
    const cateList = computed(() => {
      let cate = {}
      const item = store.state.category.list.find((item) => {
        return item.id === route.params.id
      })
      if (item) cate = item
      return cate
    })

    const goodsList = ref({})
    // 将路由参数传递，获取相应信息
    const getTopCateFn = () => {
      getTopCategory(route.params.id).then((data) => {
        goodsList.value = data.result.children
      })
    }
    // 使用watch监听路由中参数的变化，参数变化，发起请求
    watch(
      () => route.params.id,
      (newVal) => {
        // 注意：当路由改变时，且为一级类目发送请求才触发发起请求
        if (newVal && route.path === `/category/${newVal}`)getTopCateFn()
      },
      { immediate: true }
    )
    return { sliders, cateList, goodsList }
  }
}
</script>
<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
