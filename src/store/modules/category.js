// 分类信息数据

// 获取常量信息
import { conCategory } from '@/api/constant'
import { getAllCategory } from '@/api/category'

export default {
  namespaced: true,
  state: () => {
    return {
      // 先定义为常量信息
      // 注意：使用map取出，并定义其name属性，return为对象数组
      list: conCategory.map(item => ({ name: item }))
    }
  },
  mutations: {
    setList (state, newList) {
      state.list = newList
    },
    // 显示二级分类
    show (state, id) {
      const items = state.list.find(item => item.id === id)
      items.isShow = true
    },
    // 隐藏二级分类
    hide (state, id) {
      const items = state.list.find(item => item.id === id)
      items.isShow = false
    }
  },
  actions: {
    async getList ({ commit }) {
      const { result } = await getAllCategory()
      // 注入控制二级分类组件的显示/隐藏变量
      result.forEach(item => { item.isShow = false })
      commit('setList', result)
    }
  }
}
