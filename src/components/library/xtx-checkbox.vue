<template>
  <div class="xtx-checkbox" @click="changeChecked">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot/></span>
  </div>
</template>
<script>
// import { useVModel } from '@vueuse/core'
import { ref, watch } from 'vue'

export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // 1.使用原生v-model上的方法进行数据双向绑定
    const checked = ref(false)
    watch(() => props.modelValue, () => {
      checked.value = props.modelValue
    }, { immediate: true })
    const changeChecked = () => {
      checked.value = !checked.value
      emit('update:modelValue', checked.value)
      emit('change', checked.value)
    }

    /*  // 2.使用@vueuse/core上的useVModel上实现双向绑定
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      checked.value = !checked.value
      // 添加组件@change事件
      emit('change', checked.value)
    } */
    return { checked, changeChecked }
  }
}
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
