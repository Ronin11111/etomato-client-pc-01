<template>
  <div class="xtx-city" ref="target">
    <div class="select"  @click="trigger" :class="{active:show}">
      <span v-if="!fullAddress" class="placeholder">{{ placeholder }}</span>
      <span v-else class="value">{{ fullAddress }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="show">
      <div class="loading" v-if="loading"></div>
      <template v-else>
      <span class="ellipsis" v-for="item in currentAttrs" :key="item.id" @click='changeItem(item)'>{{ item.name }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, ref, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'

export default {
  name: 'XtxCitySelect',
  props: {
    fullAddress: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup (props, { emit }) {
    const show = ref(false)
    const allCity = ref([])
    // 添加loading效果
    const loading = ref(false)
    const close = () => {
      show.value = false
    }
    const open = () => {
      // 清空数据
      for (const key in changeResult) {
        changeResult[key] = ''
      }
      // 获取数据
      loading.value = true
      // 调用函数，返回promise对象
      getCityData().then(data => {
        allCity.value = data
        loading.value = false
      })
      show.value = true
    }
    const trigger = () => {
      show.value ? close() : open()
    }
    // 点击外部区域，也触发关闭事件
    const target = ref(null)
    // eslint-disable-next-line no-import-assign
    onClickOutside(target, () => {
      close()
    })
    // 定义computed，依赖allCity中的数据
    const currentAttrs = computed(() => {
      // 设置默认为省级数据
      let currentAttrs = allCity.value
      // 若省级中有数据，则显示下级数据
      if (changeResult.provinceCode && changeResult.provinceName) {
        currentAttrs = currentAttrs.find(item => item.code === changeResult.provinceCode).areaList
      }
      if (changeResult.cityName && changeResult.cityCode) {
        currentAttrs = currentAttrs.find(item => item.code === changeResult.cityCode).areaList
      }
      return currentAttrs
    })
    // 存储的地址相关数据
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    // 选择列表中区域
    const changeItem = (item) => {
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        // 关闭
        close()
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        emit('changeDate', changeResult)
      }
    }
    return { show, trigger, target, loading, allCity, currentAttrs, changeItem }
  }
}
// 获取城市数据
const getCityData = () => {
  return new Promise((resolve, reject) => {
    // 判断是否有缓存数据
    if (window.cityData) {
      resolve(window.cityData)
    } else {
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        // 进行缓存
        window.cityData = res.data
        resolve(window.cityData)
      })
    }
  })
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
