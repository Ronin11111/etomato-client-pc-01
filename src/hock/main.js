// 定义可复用的公共方法

import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

// 数据懒加载函数
export const lazyData = (api) => {
  const result = ref([])
  const target = ref(null)
  const { stop } = useIntersectionObserver(target,
    ([{ isIntersecting }], observerElement) => {
      // 处理的懒加载业务
      if (isIntersecting) {
        // 1.停止观察
        stop()
        // 2.调用api，返回结果
        api().then(data => {
          result.value = data.result
        })
      }
    }, {
      // thresholdthreshold 容器和可视区交叉的占比
      threshold: 0
    })
  // 返回观察的dom元素和请求的数据
  return { result, target }
}
