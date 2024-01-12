<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!address" class="none">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="address">
        <li><span>收<i/>货<i/>人：</span>{{address.receiver}}</li>
        <li><span>联系方式：</span>{{address.contact}}</li>
        <li><span>收货地址：</span>{{address.fullLocation+address.address}}</li>
      </ul>
      <a v-if="address">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn">切换地址</XtxButton>
      <XtxButton class="btn">添加地址</XtxButton>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
export default {
  name: 'CheckoutAddress',
  props: {
    list: {
      type: Array,
      default: () => {}
    }
  },
  setup (props) {
    // 判断地址数据中是否有值
    const address = ref(null)
    console.log(props.list)
    const defaultAds = props.list.find(item => item.isDefault === 0)
    console.log(defaultAds)
    if (defaultAds) {
      // 1.有默认数据
      address.value = defaultAds
    } else {
      if (props.list.length) {
        // 2.无默认数据，取地址[0]
        // eslint-disable-next-line vue/no-setup-props-destructure
        address.value = props.list[0]
      }
    }
    return { address }
  }
}
</script>
<style scoped lang="less">
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
