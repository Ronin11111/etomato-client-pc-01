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
