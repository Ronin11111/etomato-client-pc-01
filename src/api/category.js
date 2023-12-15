import request from '@/utils/request'

// 获取所有分类信息
export const getAllCategory = () => {
  return request('/home/category/head', 'get')
}

// 获取单个分类下的信息
export const getTopCategory = (id) => {
  return request('/category', 'get', { id })
}

//  获取二级分类筛选条件数据
export const getSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'get', { id })
}

// 获取分类下的商品（带筛选条件）
export const getSubCategoryGoods = (params) => {
  return request('/category/goods/temporary', 'post', params)
}
