// 将消息提示组件在单独的js文件中=》可通过函数调用

// 1.导入组件
import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'

// 3.创建Dom元素
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message')
document.body.appendChild(div)

// 定义定时器
let timer = null

export default ({ type, text }) => {
  // 2.将组件转为虚拟Dom元素
  const vnode = createVNode(XtxMessage, { type, text })
  // 4.将虚拟Dom渲染在Dom容器中
  render(vnode, div)
  // 5.设置定时器，一段时候后销毁组件
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 2000)
}
