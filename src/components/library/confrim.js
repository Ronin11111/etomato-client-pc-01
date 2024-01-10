// 1.导入需被创建的组件
import { createVNode, render } from 'vue'
import XtxConfirm from './xtx-comfrim.vue'

// 3.准备页面容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm')
document.body.appendChild(div)

export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    // 5.定义确认回调函数
    const confrimCallback = () => {
      console.log(111)
      render(null, div)
      resolve()
    }
    // 4.定义取消回调函数
    const cancleCallback = () => {
      console.log(222)
      render(null, div)
      reject(new Error('点击取消'))
    }

    // 2.创建虚拟节点
    const vnode = createVNode(XtxConfirm, { title, text, confrimCallback, cancleCallback })
    // 3.将虚拟节点装载在dom元素中
    render(vnode, div)
  })
}
