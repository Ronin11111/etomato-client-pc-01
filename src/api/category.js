import request from '@/utils/request'

// 获取所有分类信息
export const getAllCategory = () => {
  return request('/home/category/head', 'get')
}
