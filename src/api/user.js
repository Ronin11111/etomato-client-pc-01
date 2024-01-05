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

// QQ登录
/**
 * 第三方登录
 * @param {String} unionId - 第三方登录唯一标识
 * @param {Integer} source - 来源 1为pc，2为webapp，3为微信小程序，4为Android，5为ios,6为qq,7为微信
 * @returns Promise
 */
export const userQQLogin = (unionId, source = 6) => {
  return request('/login/social', 'post', { unionId, source })
}

/**
 * 获取QQ绑定的时候短信验证码
 * @param {String} mobile - 手机号
 * @returns promise
 */
export const userQQBindCode = (mobile) => {
  return request('/login/social/code', 'get', { mobile })
}

/**
 * QQ登录-绑定帐号
 * @param {String} unionId - QQ唯一标识，openId
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 * @returns
 */
export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request('/login/social/bind', 'post', { unionId, mobile, code })
}
