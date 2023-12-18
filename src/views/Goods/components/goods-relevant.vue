<template>
  <div class="goods-relevant">
    <div class="header">
      <i class="icon" />
      <span class="title">{{goodsId?'同类商品推荐':'猜你喜欢'}}</span>
    </div>
    <!-- 使用改造后的轮播图 -->
    <XtxCarousel :list="sliders" style="height:380px" auto-play ></XtxCarousel>
  </div>
</template>

<script>
import { ref } from 'vue'
import { findRelGoods } from '@/api/product'
export default {
  // 同类推荐，猜你喜欢
  name: 'GoodsRelevant',
  props: {
    goodsId: {
      type: String,
      default: undefined
    }
  },
  setup (props) {
    // 1.商品列表数据格式应为：[[],[],[],[]]
    const sliders = ref([])
    findRelGoods(props.goodsId).then(({ result }) => {
      const pagesize = 4
      // 注意：这里向上取整来取值
      const page = Math.ceil(result.length / pagesize)
      // 循环生成数组嵌套数组的形式
      for (let i = 0; i < page; i++) {
        sliders.value.push(result.slice(i * pagesize, (i + 1) * pagesize))
      }
    })
    return { sliders }
  }
}
</script>

<style scoped lang='less'>
.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;
  .header {
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    .title {
      font-size: 20px;
      padding-left: 10px;
    }
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-top: 4px solid @xtxColor;
      border-right: 4px solid @xtxColor;
      box-sizing: border-box;
      position: relative;
      transform: rotate(45deg);
      &::before {
        content: "";
        width: 10px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 2px;
        background: lighten(@xtxColor, 40%);
      }
    }
  }
  :deep(.xtx-carousel) {
  height: 380px;
  .carousel {
    &-indicator {
      bottom: 30px;
      span {
        &.active {
          background: @xtxColor;
        }
      }
    }
    &-btn {
      top: 110px;
      opacity: 1;
      background: rgba(0,0,0,0);
      color: #ddd;
      i {
        font-size: 30px;
      }
    }
  }
}
}
</style>
