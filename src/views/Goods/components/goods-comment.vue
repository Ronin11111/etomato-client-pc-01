<template>
  <div class="goods-comment">
    <div class="head">
      <div class="data">
        <p><span>100</span><span>人购买</span></p>
        <p><span>99.99%</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a v-for="(item,index) in tags" @click="changeActive(index,item)" :key="index" href="javascript:;" :class="{active:active===index}">{{item.title}}（{{item.tagCount}}）</a>
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a @click="changeSort(null)" href="javascript:;" :class="{active:dataList.sortField===null}">默认</a>
      <a @click="changeSort('praiseCount')" href="javascript:;" :class="{active:dataList.sortField==='praiseCount'}">最新</a>
      <a @click="changeSort('createTime')" href="javascript:;" :class="{active:dataList.sortField==='createTime'}">最热</a>
    </div>
    <!-- 列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="(item,ind) in commentList" :key="ind">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{ crypName(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <i v-for="it in item.score" :key="it" class="iconfont icon-wjx01"></i>
            <i v-for="ti in 5-item.score" :key="ti"  class="iconfont icon-wjx02"></i>
            <span class="attr">{{ formatSpec(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">{{ item.content }}</div>
          <!-- 图片预览组件 -->
          <CommentImage v-if="item.pictures.length" :pictures="item.pictures"></CommentImage>
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页组件 -->
    <XtxPagination @change-page="changePageFn" :newCurrentPage="dataList.page" :newTotal="total"></XtxPagination>
  </div>
</template>

<script>
import CommentImage from './goods-comment-image'
import { findCommentInfoByGoods, findCommentList } from '@/api/product'
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'GoodsComment',
  components: { CommentImage },
  setup () {
    const route = useRoute()
    const goodsId = route.params.id
    // 激活参数值
    const active = ref(0)
    const tags = ref(null)
    const total = ref(null)
    // 设置请求参数
    const dataList = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      sortField: null // 最新/最热
    })
    // 定义评论列表
    const commentList = ref(null)
    // console.log(goodsId)
    findCommentInfoByGoods(goodsId).then(({ result }) => {
      console.log(result)
      tags.value = result.tags
      // 在tags前添加两个标签
      tags.value.unshift({ title: '有图', tagCount: result.hasPictureCount, type: 'pic' })
      tags.value.unshift({ title: '全部', tagCount: result.evaluateCount, type: 'all' })
    })
    const changeActive = (ind, item) => {
      active.value = ind
      if (item.type === 'pic') {
        dataList.hasPicture = true
        dataList.tag = null
      } else if (item.type === 'all') {
        dataList.hasPicture = null
        dataList.tag = null
      } else {
        dataList.hasPicture = item.title
        dataList.tag = item.title
      }
      // 注意：每次请求前，将page置为1
      dataList.page = 1
    }
    const changeSort = (sort) => {
      dataList.sortField = sort
      dataList.page = 1
    }
    // 监听参数对象变化，发请求，渲染数据
    watch(dataList, () => {
      findCommentList({ goodsId, dataList }).then(({ result }) => {
        console.log(result)
        commentList.value = result.items
        total.value = result.counts
      })
    }, { immediate: true })
    // 格式化字符串
    const formatSpec = (specs) => {
      return specs.reduce((i, item) => `${i} ${item.name}:${item.nameValue}`, '').trim()
    }
    // 匿名处理
    const crypName = (name) => {
      return name.substr(0, 1) + '****' + name.substr(-1)
    }
    // 接收子组件值
    const changePageFn = (value) => {
      dataList.page = value
    }
    return { tags, active, changeActive, dataList, changeSort, commentList, formatSpec, crypName, total, changePageFn }
  }
}
</script>

<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor,50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,&:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
