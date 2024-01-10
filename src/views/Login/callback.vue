<template>
  <LoginHeader>联合登录</LoginHeader>
  <!-- 已绑定效果 -->
  <section class="container" v-if="isBind">
  <div class="unbind">
    <div class="loading"></div>
  </div>
  </section>
    <!-- 未绑定效果 -->
  <section class="container" v-else>
    <nav class="tab">
      <a @click="hasAccount=true" :class="{active:hasAccount}" href="javascript:;">
        <i class="iconfont icon-bind" />
 <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a @click="hasAccount=false" :class="{active:!hasAccount}" href="javascript:;">
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackPhone :unionId="unionId"/>
    </div>
    <div class="tab-content" v-else>
      <CallbackInfo :unionId="unionId"/>
    </div>
  </section>
  <LoginFooter></LoginFooter>
</template>

<script>
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import { ref } from 'vue'
import CallbackInfo from './components/callback-info'
import CallbackPhone from './components/callback-phone'
import QC from 'qc'
import { userQQLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Message from '@/components/library/message'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Callback',
  components: {
    LoginHeader,
    LoginFooter,
    CallbackInfo,
    CallbackPhone
  },
  setup () {
    const hasAccount = ref(true)
    const isBind = ref(false)
    const unionId = ref(null)
    const store = useStore()
    const router = useRouter()
    // 在组件初级化时，获取QQ的openID
    // 1.1.先判断QQ是否登录
    if (QC.Login.check()) {
      // 1.2.获取QQ的openId
      QC.Login.getMe((openId) => {
        // console.log(openId)
        unionId.value = openId
        // 1.3.判断是否登录
        userQQLogin(openId).then((data) => {
          // 1.4.登录成功，存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 1.5.合并购物车
          store.dispatch('cart/mergeCart').then(() => {
            // 1.6.跳转至首页/指定页面
            router.push(store.state.user.redirectUrl)
            // 1.7.提示登录消息
            Message({ type: 'success', text: '登录成功' })
          })
        }).catch(e => {
          // 代表：使用qq登录失败===>1. 没绑定小兔鲜帐号  2. 没有小兔鲜帐号
          isBind.value = false
        })
      })
    }
    return { hasAccount, isBind, unionId }
  }
}
</script>

<style scoped lang='less'>
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
