<template>
  <div class="sub-filter" v-if="filterData&&filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a @click="changeBrand(item.id)" href="javascript:;" :class="{active:filterData.selectedBrand===item.id}" v-for="item in filterData.brands" :key="item.id">{{item.name}}</a>
      </div>
    </div>
    <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
      <div class="head">{{item.name}}：</div>
      <div class="body">
        <a @click="changeAttr(item,prop.id)" href="javascript:;" :class="{active:item.selectedProp===prop.id}" v-for="prop in item.properties" :key="prop.id">{{prop.name}}</a>
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    // 监听二级类目ID的变化获取筛选数据
    const filterData = ref(null)
    // 数据加载效果
    const filterLoading = ref(false)
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/sub/${newVal}` === route.path) {
        filterLoading.value = false
        getSubCategoryFilter(route.params.id).then(({ result }) => {
          // 1. 品牌
          result.selectedBrand = null
          result.brands.unshift({ id: null, name: '全部' })
          // 2. 属性
          result.saleProperties.forEach(item => {
            item.selectedProp = null
            item.properties.unshift({ id: null, name: '全部' })
          })
          // 设置修改的数据
          filterData.value = result
          filterLoading.value = true
        })
      }
    }, { immediate: true })

    // 获取请求参数的函数
    const getFilterParams = () => {
      const params = {}
      const attrs = []
      params.brandId = filterData.value.selectedBrand
      filterData.value.saleProperties.forEach(item => {
        if (item.selectedProp) {
          const attr = item.properties.find(obj => obj.id === item.selectedProp)
          attrs.push({ groupName: item.name, propertyName: attr.name })
        }
      })
      // 作用：当没有商品信息时，将params.attrs至为null，当为null时，不会发请求
      if (params.attrs.length === 0) { params.attrs = null }
      return params
    }

    // 品牌改变
    const changeBrand = (id) => {
      if (filterData.value.selectedBrand === id) return
      filterData.value.selectedBrand = id
      emit('filterChange', getFilterParams())
    }

    // 品类改变
    const changeAttr = (item, id) => {
      if (item.selectedProp === id) return
      item.selectedProp = id
      emit('filterChange', getFilterParams())
    }

    return { filterData, filterLoading, changeBrand, changeAttr }
  }
}
</script>
<style scoped lang='less'>
  // 筛选区
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all .3s;
          display: inline-block;
          &.active,
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
    .xtx-skeleton {
      padding: 10px 0;
    }
  }
</style>
