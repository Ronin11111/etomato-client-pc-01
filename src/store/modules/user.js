// 用户信息数据

export default {
  // 规定：子模块中的state必须写成函数形式return数据
  state () {
    return {
      // 用户信息
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      }
    }
  }
}
