import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'

import cart from './modules/cart'
import category from './modules/category'
import user from './modules/user'

export default createStore({
  modules: {
    // 子模块导入
    user,
    cart,
    category
  },
  // 配置persistedState插件信息
  plugins: [
    createPersistedstate({
      key: 'etomato-clint-state',
      // path即为需做持久化的模块
      paths: ['cart', 'user']
    })
  ]

})
