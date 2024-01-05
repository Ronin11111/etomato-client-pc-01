import { userCheckAccount } from '@/api/user'
// 表单校验规则
export default {
  account (value) {
    if (!value) return '用户名不能为空'
    // 字母开头，6-20个字符
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-12个字符'
    return true
  },
  async accountApi (value) {
    if (!value) return '用户名不能为空'
    // 字母开头，6-20个字符
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-12个字符'
    const { result } = await userCheckAccount(value)
    if (result.valid) return '用户名已存在'
    return true
  },
  password (value) {
    if (!value) return '密码不能为空'
    if (!/^\w{6,12}$/.test(value)) return '密码为6-12个字符'
    return true
  },
  repassword (value, { form }) {
    if (!value) return '密码不能为空'
    if (!/^\w{6,12}$/.test(value)) return '密码为6-12个字符'
    if (value !== form.repassword) return '与原密码不一致'
    return true
  },
  mobile (value) {
    if (!value) return '手机号不能为空'
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式错误'
    return true
  },
  code (value) {
    if (!value) return '验证码不能为空'
    if (!/^\d{6}$/.test(value)) return '验证码为6个数字'
    return true
  },
  isAgree (value) {
    if (!value) return '请勾选用户协议'
    return true
  }
}
