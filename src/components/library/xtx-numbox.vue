<template>
  <div class="xtx-numbox">
    <div class="label">{{ label }}</div>
    <div class="numbox">
      <a @click="changeNum(-1)">-</a>
      <input type="text" readonly :value="modelValue">
      <a @click="changeNum(1)">+</a>
    </div>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxNumbox',
  props: {
    modelValue: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 999
    },
    label: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const changeNum = (step) => {
      const numVal = useVModel(props, 'modelValue', emit)
      const newVal = numVal.value + step
      if (newVal < props.min || newVal > props.max) return false
      numVal.value = newVal
      // console.log(newVal)
      // 给该组件绑定@change事件
      emit('change', newVal)
    }
    return { changeNum }
  }
}
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right:1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left:1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
