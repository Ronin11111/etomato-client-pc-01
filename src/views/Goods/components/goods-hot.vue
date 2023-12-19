<template>
  <div class="goods-hot">
    <h3>{{ title }}</h3>
    <!-- 商品组件 -->
    <goods-item v-for="item in list" :key="item.id" :goods="item"></goods-item>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { findHotGoods } from '@/api/product.js'
import GoodsItem from '@/views/Category/components/cate-goodsItem.vue'
export default {
  name: 'GoodsHot',
  components: { GoodsItem },
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  setup (props) {
    const typeAll = { 1: '24小时热销榜', 2: '周热销榜', 3: '总热销榜' }
    const title = computed(() => {
      return typeAll[props.type]
    })
    const list = ref([])
    const route = useRoute()
    findHotGoods({ id: route.params.id, type: props.type }).then(({ result }) => {
      list.value = result
    })
    return { title, list }
  }
}
</script>

<style lang="less" scoped>
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  ::v-deep .goods-item {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
