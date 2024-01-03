import request from '@/utils/request'

// 用户登录
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}

// 发送验证码
export const userMobileLoginMsg = (mobile) => {
  request('/login/code', 'get', { mobile })
}

// 手机号登录
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}
