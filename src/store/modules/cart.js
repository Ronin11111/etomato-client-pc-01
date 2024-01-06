
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
    }
  },
  mutations: {
    insertCart (state, goods) {
      const index = state.list.findIndex(item => item.skuId === goods.skuId)
      // 1.判断state中是否有相同商品数据
      if (index > -1) {
        console.log(index)
        const count = state.list[index].count
        state.list.splice(index, 1)
        goods.count += count
      }
      state.list.unshift(goods)
    }
  },
  actions: {
    insertCart (context, goods) {
      // 1.判断用户是否为登录状态
      // 注意：需return Promise对象
      return new Promise((resolve, reject) => {
        // 在另一个子模块中获取另一子模块中的state
        if (context.rootState.user.token) {
          // 1.1.登录状态
        } else {
          // 1.2.未登录状态
          context.commit('insertCart', goods)
          resolve()
        }
      })
    }
  }
}
