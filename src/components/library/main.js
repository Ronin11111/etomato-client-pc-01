import defaultImg from '@/assets/images/200.png'
import Message from './message'

// 自动批量注册组件
const importFn = require.context('./', false, /\.vue$/)

// 封装全局插件
export default {
  install (app) {
    importFn.keys().forEach(key => {
      const component = importFn(key).default
      app.component(component.name, component)
    })
    // 注册全局指令
    usedirective(app)
    // 挂载message（提示消息）的原型方法
    app.config.globalProperties.$message = Message
  }
}

// 全局指令
const usedirective = (app) => {
  app.directive('lazyImg', {
    // 在mounted阶段才可获取元素ref
    mounted (el, binding) {
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 关闭观察
          observe.unobserve(el)
          // 监听图片加载失败,显示默认图片
          el.onerror = () => {
            el.src = defaultImg
          }
          // 加载成功，将图片地址赋值给图片src
          el.src = binding.value
        }
      }, {
        threshold: 0
      })
      // 开启观察
      observe.observe(el)
    }
  })
}
