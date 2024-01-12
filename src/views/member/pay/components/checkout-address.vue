<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!address" class="none">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="address">
        <li><span>收<i/>货<i/>人：</span>{{address.receiver}}</li>
        <li><span>联系方式：</span>{{address.contact.replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2')}}</li>
        <li><span>收货地址：</span>{{address.fullLocation.replace(/ /g,'')}}{{address.address}}</li>
      </ul>
      <a v-if="address" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton @click="openAdd" class="btn">切换地址</XtxButton>
      <XtxButton class="btn">添加地址</XtxButton>
    </div>
  </div>
  <!-- 对话框组件-切换收货地址 -->
  <XtxDialog title="切换收货地址" v-model:visible="visible">
    <div @click="selectedAdd=item" :class="{active:selectedAdd&&selectedAdd.id===item.id}" class="text item" v-for="item in list" :key="item.id">
      <ul>
        <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
        <li><span>联系方式：</span>{{item.contact.replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2')}}</li>
        <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'')+item.address}}</li>
      </ul>
    </div>
    <template #footer>
      <XtxButton @click="visible=false" type="gray" style="margin-right:20px">取消</XtxButton>
      <XtxButton @click="confrimAdd" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
  <!-- 收货地址添加编辑组件 -->
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
  emits: ['change'], // 声明组件中提交的自定义事件
  setup (props, { emit }) {
    // 控制对话框显示隐藏
    const visible = ref(false)
    // 判断地址数据中是否有值
    const address = ref(null)
    console.log(props.list)
    const defaultAds = props.list.find((item) => item.isDefault === 0)
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
    // 选中的数据
    const selectedAdd = ref(null)
    // 切换地址对话框
    const openAdd = () => {
      visible.value = true
      // 打开时清空已选中数据
      selectedAdd.value = null
    }
    // 确认地址
    const confrimAdd = () => {
      visible.value = false
      address.value = selectedAdd.value
      emit('change', address.value?.id)
    }
    // 向父组件提交地址id值 =>?.即在赋值前先判断address中是否有值
    // address.value?.id <==>address.value&&address.value.id
    emit('change', address.value?.id)
    return { address, visible, selectedAdd, confrimAdd, openAdd }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
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
