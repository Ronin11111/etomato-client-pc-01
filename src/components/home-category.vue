<template>
  <div class="home-category" @mouseleave="currentId=null">
    <ul class="menu">
      <li :class="{active:currentId===item.id}" v-for="item in list" :key="item.id" @mouseenter="currentId = item.id">
        <RouterLink to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        <template v-if="item.children">
          <RouterLink
            to="`/category/sub/${item.id}`"
            v-for="sub in item.children"
            :key="sub.id"
            >{{ sub.name }}</RouterLink
          >
        </template>
      </li>
    </ul>
    <!-- 弹层 -->
    <div class="layer">
      <h4>{{currentGoods && currentGoods.id==='brand'?'品牌':'分类'}}推荐 <small>根据您的购买或浏览记录推荐</small></h4>
      <!-- 商品推荐 -->
      <!-- 注意：先判断是否有数据 -->
      <ul v-if="currentGoods && currentGoods.goods && currentGoods.goods.length"
      >
        <li v-for="item in currentGoods.goods" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="" />
            <div class="info">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="desc ellipsis">{{ item.desc }}</p>
              <p class="price"><i>¥</i>{{ item.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <!-- 品牌推荐 -->
      <ul v-if="currentGoods && currentGoods.brands && currentGoods.brands.length">
        <li class="brand" v-for="sub in currentGoods.brands" :key="sub.id">
          <RouterLink to="/">
            <img :src="sub.picture" alt="" />
            <div class="info">
              <p class="place">
                <i class="iconfont icon-dingwei"></i>{{ sub.place }}
              </p>
              <p class="name ellipsis">{{ sub.name }}</p>
              <p class="desc ellipsis-2">{{ sub.desc }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { getBrand } from '@/api/home'

export default {
  name: 'HomeCategory',
  setup () {
    const brand = reactive({
      name: '品牌',
      id: 'brand',
      children: [{ id: 'brand-chilren', name: '品牌推荐' }],
      brands: []
    })
    const store = useStore()
    const list = computed(() => {
      return store.state.category.list.map((item) => {
        // 手动取值
        return {
          name: item.name,
          id: item.id,
          // 使用slice（）截取数组中的前两个
          children: item.children && item.children.slice(0, 2),
          goods: item.goods
        }
      })
    })
    // 将品牌对象追加至数组中
    list.value.push(brand)

    // 定义当前栏目Id
    const currentId = ref(null)
    const currentGoods = computed(() => {
      return list.value.find((item) => item.id === currentId.value)
    })

    // 获取brand中的数据
    getBrand().then(data => {
      brand.brands = data.result
    })
    return { list, currentId, currentGoods }
  }
}
</script>

<style scoped lang='less'>
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,&.active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            width: 190px;
            padding-left: 10px;
            line-height: 24px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
      li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
</style>
