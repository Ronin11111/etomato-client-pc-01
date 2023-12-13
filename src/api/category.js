import request from '@/utils/request'

// 获取所有分类信息
export const getAllCategory = () => {
  return request('/home/category/head', 'get')
}

// 获取单个分类下的信息
export const getTopCategory = (id) => {
  return request('/category', 'get', { id })
}
