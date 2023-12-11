// 首页请求
import request from '@/utils/request'

// 获取品牌中的品牌推荐
export const getBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}

// 获取轮播图图片
export const getBanner = () => {
  return request('/home/banner', 'get')
}

// 获取新鲜好物商品
export const getGoods = () => {
  return request('home/new', 'get')
}

// 获取人气好物推荐
export const getHot = () => {
  return request('home/hot', 'get')
}
