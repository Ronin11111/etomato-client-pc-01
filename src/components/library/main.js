import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './xtx-carousel.vue'
import XtxMore from './xtx-more.vue'
import defaultImg from '@/assets/images/200.png'
import XtxBread from './xtx-bread.vue'
import XtxBreadItem from './xtx-bread-item.vue'

// 封装全局插件
export default {
  install (app) {
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)
    app.component(XtxBread.name, XtxBread)
    app.component(XtxBreadItem.name, XtxBreadItem)
    // 注册全局指令
    usedirective(app)
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
