<template>
  <div class='xtx-goods-page'>
    <div class="container" v-if="goods">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="'/category/'+goods.categories[0].id">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem :to="'/category/sub/'+goods.categories[1].id">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem>{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
          <!-- 商品销售 -->
          <GoodsSales />
        </div>
        <div class="spec">
          <!-- 商品介绍 -->
          <GoodsName :goods="goods"/>
          <!-- SKU规格组件 -->
          <GoodsSku :goods="goods" @change="changeFn"></GoodsSku>
          <!-- 数量选择组件 -->
          <XtxNumbox v-model="num" label="数量" :max="goods.inventory"></XtxNumbox>
          <!-- 按钮组件 -->
          <XtxButton @click="addCart" type="primary" style="margin-top:20px;">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant/>
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs></GoodsTabs>
          <!-- 注意事项 -->
          <GoodsWarn></GoodsWarn>
        </div>
        <!-- 24热榜/周榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :type="1"></GoodsHot>
          <GoodsHot :type="2"></GoodsHot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-images.vue'
import GoodsSales from './components/goods-sale'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot.vue'
import GoodsWarn from './components/goods-warn.vue'
import Message from '@/components/library/message'

import { findGoods } from '@/api/product'
import { watch, ref, nextTick, provide } from 'vue'
import { useRoute } from 'vue-router'
import store from '@/store'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsWarn, GoodsHot, GoodsName, GoodsSku, GoodsTabs },
  setup () {
    // 调用获取商品信息的函数
    const goods = getGoodsInfo()
    // 将商品信息数据传给后代组件
    provide('goods', goods)
    // 商品数量
    const num = ref(1)
    const changeFn = (sku) => {
      // 修改传给子组件中的信息
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      // 存储sku商品信息,方便做购物车判断
      currentSku.value = sku
    }

    // 3.存储购物车商品
    const currentSku = ref(null)
    const addCart = () => {
      // 3.1.判断购物车信息是否为空
      if (currentSku.value && currentSku.value.skuId) {
        // 3.2.解构商品信息
        const { id, name, mainPictures } = goods.value
        const { inventory, specsText, skuId, price } = currentSku.value
        store.dispatch('cart/insertCart', {
          skuId,
          price,
          nowPrice: price,
          id,
          name,
          picture: mainPictures[0],
          count: num.value,
          attrsText: specsText,
          selected: true,
          isEffective: true,
          stock: inventory
        }).then(() => {
          Message({ type: 'success', text: '添加购物车成功' })
        })
      } else {
        Message({ text: '请选择完整规格' })
      }
    }
    return { goods, num, changeFn, addCart }
  }
}
// 获取商品信息
const getGoodsInfo = () => {
  const goods = ref(null)
  const route = useRoute()
  // 动态监听路由变化
  watch(() => route.params.id, (newVal) => {
    if (newVal && route.path === `/product/${newVal}`) {
      findGoods(route.params.id).then(({ result }) => {
      // 每次更新数据前，先将数据值为null，v-if即会销毁和重新创建数据
        goods.value = null
        nextTick(() => {
          goods.value = result
        })
      })
    }
  }, { immediate: true })
  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
