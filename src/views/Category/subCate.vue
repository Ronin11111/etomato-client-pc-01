<template>
  <div class="sub-cate">
    <div class="container">
      <!-- 面包屑组件 -->
      <CateBread></CateBread>
      <!-- 筛选区域 -->
      <SubFilter @filterChange="getFilter"></SubFilter>
      <!-- 结果区域：排序+列表 -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort @sortChange="getSortFilter"></SubSort>
        <!-- 商品列表 -->
        <ul>
          <li v-for="item in goodsList" :key="item.id">
            <GoodsItem :goods="item" />
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <XtxInfiniteLoading
          :loading="loading"
          :finished="finished"
          @infinite="getGoods"
        ></XtxInfiniteLoading>
      </div>
    </div>
  </div>
</template>

<script>
import CateBread from './components/cate-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/cate-goodsItem.vue'
import { ref, watch } from 'vue'
import { getSubCategoryGoods } from '@/api/category.js'
import { useRoute } from 'vue-router'

export default {
  name: 'SubCategory',
  components: {
    CateBread,
    SubFilter,
    SubSort,
    GoodsItem
  },
  setup () {
    const isTrue = true
    const loading = ref(false)
    const finished = ref(false)
    const goodsList = ref([])
    const route = useRoute()
    let params = {
      page: 1,
      pagesize: 20
    }
    const getGoods = () => {
      loading.value = true
      // 注意：传入的参数需要有页面的id
      params.id = route.params.id
      getSubCategoryGoods(params).then(({ result }) => {
        // 1.判断是否有数据
        if (result.items.length) {
          goodsList.value.push(...result.items)
          params.page++
        } else {
          finished.value = true
        }
      })
      loading.value = false
    }
    watch(() => route.params.id, (newVal) => {
      if (newVal && newVal === `/category/sub/${newVal}`) {
      // 二级路由切换，将数据初始化和置空
        finished.value = false
        goodsList.value = []
        params = {
          page: 1,
          pagesize: 20
        }
      }
    }, { immediate: true })

    // 1.筛选条件中值改变，改变请求参数
    const getSortFilter = (sortParams) => {
      // 将finished设为false
      finished.value = false
      goodsList.value = []
      // 重新整合条件
      params = { ...params, ...sortParams }
      params.page = 1
    }

    // 2.筛选信息改变，请求参数改变
    const getFilter = (filterParams) => {
      finished.value = false
      goodsList.value = []
      // 重新整合条件
      params = { ...params, ...filterParams }
      params.page = 1
    }
    return { isTrue, finished, loading, goodsList, getGoods, getSortFilter, getFilter }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
