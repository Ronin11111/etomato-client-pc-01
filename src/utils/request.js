import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 导出baseURL,有些请求不是使用axios发起
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
// 1.实例化axios，并配置基本属性，即基地址和超时时间
const request = axios.create({
  baseURL,
  timeout: 5000
})

// 2.设置请求拦截器
request.interceptors.request.use(config => {
  // 2.1.实现token的注入
  if (store.state.user.profile.token) {
    // 2.2.将token注入headers中
    config.headers.Authorization = `Bearer ${store.state.user.profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 3.设置响应拦截器
// 3.1.解剖数据
// 3.2.处理无效token
request.interceptors.response.use(res => res.data, err => {
  if (err.response && err.response.status === 401) {
    // ①将用户信息清空
    store.commit('user/setUser', {})
    // 注意：将路径进行解码，避免有特殊字符
    const curPath = encodeURIComponent(router.currentRoute.value.fullPath)
    // ②跳转至登录页
    // ③传参，登录页的路径中需携带当前页面路径
    router.push('/login?curPath' + curPath)
  }
  return Promise.reject(err)
})

// 4.导出请求函数，返回Promise
// 注意：这里需携带axios发请求的必要参数来导出
export default (url, method, subData) => {
  return request({
    url,
    method,
    // 注意：调用请求时，需判断请求类型
    // 请求类型不同，传递内容的形式不同
    // 使用[]:来接收动态参数，判断请求类型
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: subData
  })
}
