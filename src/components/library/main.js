import XtxSkeleton from './xtx-skeleton.vue'

// 封装全局插件
export default {
  install (app) {
    app.component(XtxSkeleton.name, XtxSkeleton)
  }
}
