import { getNewCartGoods } from '@/api/cart'

// 购物车信息数据
export default {
  namespaced: true,
  state () {
    return {
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList (state) {
      return state.list.filter(item => item.stock > 0 && item.isEffective)
    },
    // 有效商品总数量
    validCount (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品价格
    validPrice (state, getters) {
      // 注意：浮点数的计算问题
      return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(item => item.stock <= 0 || !item.isEffective)
    },
    // 选中商品列表
    selectedList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 选中商品列表数量
    selectedCount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品金额
    selectedPrice (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0)
    },
    // 是否全选
    isAll (state, getters) {
      return getters.selectedList.length > 0 && getters.validList.length === getters.selectedList.length
    }
  },
  mutations: {
    // 1.添加购物车商品信息
    insertCart (state, goods) {
      const index = state.list.findIndex(item => item.skuId === goods.skuId)
      // 1.判断state中是否有相同商品数据
      if (index > -1) {
        // console.log(index)
        const count = state.list[index].count
        state.list.splice(index, 1)
        goods.count += count
      }
      state.list.unshift(goods)
    },
    // 2.修改购物车商品信息
    updateCart (state, goods) {
      const goodsList = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goodsList) {
        // 2.1.判断是否为合法有效值
        if (!goods[key] !== '' && goods[key] !== undefined && goods[key] !== null) {
          goodsList[key] = goods[key]
        }
      }
    },
    // 3.删除购物车信息
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    }
  },
  actions: {
    // 1.添加购物车信息
    insertCart (context, goods) {
      // 1.判断用户是否为登录状态
      // 注意：需return Promise对象
      return new Promise((resolve, reject) => {
        // 在另一个子模块中获取另一子模块中的state
        if (context.rootState.user.profile.token) {
          // 1.1.登录状态
        } else {
          // 1.2.未登录状态
          context.commit('insertCart', goods)
          resolve()
        }
      })
    },
    // 2.添加购物车信息
    updateCart (context) {
      // 2.1.创建promise对象
      return new Promise((resolve, reject) => {
        // 2.2.判断是否登录
        if (context.rootState.user.profile.token) {
          // 已登录
        } else {
          const goodList = context.state.list.map(item => { return getNewCartGoods(item.skuId) })
          Promise.all(goodList).then((data) => {
            // 未登录
            data.forEach((it, index) => context.commit('updateCart', { skuId: context.state.list[index], ...it.result }))
            resolve()
          }).catch(e => reject(e))
        }
      })
    },
    // 4.修改购物车数据
    updateSelected (context, payloay) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
        } else {
          context.commit('updateCart', payloay)
          resolve()
        }
      })
    },
    // 5.全选操作数据修改
    isAllSelected (context, selected) {
      return new Promise((resolve, reject) => {
        if (context.rootState.profile.user.token) {
          //
        } else {
          context.getters.validList.forEach(item => context.commit({ skuId: item.skuId, selected }))
          resolve()
        }
      })
    },
    // 3.删除购物车信息
    deleteCart (context, skuId) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
        } else {
          context.commit('deleteCart', skuId)
          resolve()
        }
      })
    },
    // 6.批量删除购物车中的商品-清除无效商品
    batchDelete (context, isBatch) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          //
        } else {
          context.getters[isBatch ? 'selectedList' : 'invalidList'].forEach(item => {
            context.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    // 7.修改购物车商品Sku信息
    updateSku (context, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          //
        } else {
          // 7.1.找到旧商品列
          const oldGoods = context.state.list.find(item => item.skuId === oldSkuId)
          // 7.2.删除旧商品列
          context.commit('deleteCart', oldSkuId)
          // 7.3.将旧商品信息和新商品信息合并成为新商品数据
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          // 4. 插入新数据
          context.commit('insertCart', newGoods)
          resolve()
        }
      })
    }
  }
}
