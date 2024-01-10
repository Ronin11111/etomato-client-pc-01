<template>
  <div class="cart-sku">
    <div class="attrs" @click="toggle()" >
      <span class="ellipsis">{{ infoText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div ref="target" class="layer" v-if="show">
      <div v-if="loading" class="loading"></div>
      <GoodsSku v-else  @change="changeSuk" :skuId="skuId" :goods="goods"></GoodsSku>
      <!-- 选择按钮 -->
      <XtxButton @click="submit" v-if="!loading" type="primary" size="mini" style="margin-left:60px">确认</XtxButton>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { getSpecsAndSkus } from '@/api/product'
import GoodsSku from '@/views/Goods/components/goods-sku.vue'

export default {
  name: 'CartSku',
  components: { GoodsSku },
  props: {
    infoText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 商品数据
    const goods = ref(null)
    // loading加载效果
    const loading = ref(null)
    const show = ref(false)
    // 打开
    const open = () => {
      console.log(props.skuId)
      show.value = true
      // 开启加载
      loading.value = true
      // 获取数据
      getSpecsAndSkus(props.skuId).then(data => {
        goods.value = data.result
        loading.value = false
      })
    }
    // 关闭
    const close = () => {
      show.value = false
      // 注意：关闭清空商品信息
      goods.value = null
    }
    // 切换
    const toggle = () => {
      show.value ? close() : open()
    }
    // 点击其他区域关闭
    const target = ref(null)
    onClickOutside(target, () => {
      show.value = false
    })
    // 商品sku组件中-记录新sku信息变化
    const newSku = ref(null)
    const changeSuk = (sku) => {
      newSku.value = sku
    }
    // 提交按钮-向购物车传递新sku商品信息
    const submit = () => {
      // 1.先判断新Sku信息
      if (newSku.value && newSku.value.skuId && newSku.value.skuId !== props.skuId) {
        emit('change', newSku.value)
        // console.log(newSku.value)
        close()
      }
    }
    return { show, toggle, target, goods, loading, changeSuk, submit }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display:inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor,50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(.8,1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
