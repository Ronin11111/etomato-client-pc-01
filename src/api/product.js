// 有关商品信息的数据
import request from '@/utils/request'

// 获取商品详情
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}

// 获取同类推荐和猜你喜欢
// 未传入ID-猜你喜欢 否则为同类推荐
export const findRelGoods = (id, limit = 16) => {
  return request('/goods/relevant', 'get', { id, limit })
}

// 获取热榜组件
export const findHotGoods = ({ id, type, limit = 3 }) => {
  return request('/goods/hot', 'get', { id, type, limit })
}

// 获取产品评论数量信息
export const findCommentInfoByGoods = (id) => {
  // return request(`/goods/${id}/evaluate`)
  // 模拟数据接口
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')
}

// 获取产品评论列表
export const findCommentList = (id, params) => {
  // return request(`/goods/${id}/evaluate`)
  // 模拟数据接口
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', params)
}

/**
 * 获取商品的specs和skus
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
export const getSpecsAndSkus = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'get')
}
