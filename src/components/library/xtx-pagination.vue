<template>
  <div class="xtx-pagination">
    <a v-if="currentPage<=1" href="javascript:;" class="disabled">上一页</a>
    <a v-else @click="changePage(currentPage-1)" href="javascript:;">上一页</a>
    <span v-if="page.start>1">...</span>
    <a @click="changePage(item)" v-for="item in page.btns" :key="item" :class="{active:item===currentPage}">{{ item }}</a>
    <span v-if="page.end<page.allPage">...</span>
    <a v-if="currentPage>=page.allPage" href="javascript:;" class="disabled">下一页</a>
    <a v-else @click="changePage(currentPage+1)"  href="javascript:;">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    newCurrentPage: {
      type: Number,
      default: 1
    },
    newTotal: {
      type: Number,
      default: 100
    },
    newNumber: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit }) {
    // 1.按钮个数
    const btnNum = 5
    // 2.当前页码
    const currentPage = ref(1)
    // 3.总条数
    const total = ref(100)
    // 4.每页显示条数
    const number = ref(10)
    // 总页码数，起始按钮，结束按钮，按钮数组=》计算属性
    const page = computed(() => {
      // 5.总页码个数,向上取整
      const allPage = Math.ceil(total.value / number.value)
      // 6.1.理想情况下，依据当前按钮和按钮个数，得到起始，结束按钮
      const offsets = Math.floor(btnNum / 2) // 偏移量
      let start = currentPage.value - offsets
      let last = start + btnNum - 1
      // 6.2.若起始按钮<1
      if (start < 1) {
        start = 1
        // 同时，判断结束按钮是否合法
        last = (start + btnNum - 1) > allPage ? allPage : (start + btnNum - 1)
      }
      // 6.3.若结束按钮>总页数
      if (last > allPage) {
        last = allPage
        start = (last - btnNum + 1) < 1 ? 1 : (last - btnNum + 1)
      }
      // 7.按钮数组=》依据起始，结束按钮，for循环生成按钮数组
      const btns = []
      for (let i = start; i <= last; i++) {
        btns.push(i)
      }
      return { allPage, start, last, btns }
    })
    // 监听props变化，并赋值
    watch(props, () => {
      // console.log(props.newNumber)
      number.value = props.newNumber
      total.value = props.newTotal
      currentPage.value = props.newCurrentPage
    }, { immediate: true })
    // 通知父组件，重新获取数据
    const changePage = (value) => {
      if (currentPage.value !== value) {
        currentPage.value = value
        emit('change-page', value)
      }
    }
    return { btnNum, currentPage, page, changePage }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
