<template>
  <div class="sub-filter" v-if="filterData&&filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a @click="filterData.selectedBrand=item.id" href="javascript:;" :class="{active:filterData.selectedBrand===item.id}" v-for="item in filterData.brands" :key="item.id">{{item.name}}</a>
      </div>
    </div>
    <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
      <div class="head">{{item.name}}：</div>
      <div class="body">
        <a @click="item.selectedProp=prop.id" href="javascript:;" :class="{active:item.selectedProp===prop.id}" v-for="prop in item.properties" :key="prop.id">{{prop.name}}</a>
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
  setup () {
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

    return { filterData, filterLoading }
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
