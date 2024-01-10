<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form ref="loginForm" class="form" :validation-schema="schema" v-slot="{errors}" autocomplete="off">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field v-model="form.account" name="account" type="text" :class="{error:errors.account}" placeholder="请输入用户名" />
          </div>
          <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{ errors.account }}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field v-model="form.password" name="password" type="password" :class="{error:errors.password}" placeholder="请输入密码"/>
          </div>
          <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{ errors.password }}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field v-model="form.mobile" name="mobile" type="text" :class="{error:errors.mobile}" placeholder="请输入手机号" />
          </div>
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{ errors.mobile }}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field v-model="form.code" name="code" type="text" :class="{error:errors.code}" placeholder="请输入验证码"/>
            <span @click="sendCode" class="code">{{time===0?'发送验证码':`${time}秒`}}</span>
          </div>
          <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{ errors.code }}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" v-model="form.isAgree" name="isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree"><i class="iconfont icon-warning" />{{ errors.isAgree }}</div>
      </div>
      <a @click="login" class="btn">登录</a>
    </Form>
    <div class="action">
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, ref, watch, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate'
import Message from '@/components/library/message'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
// import QC from 'qc';

export default {
  name: 'LoginForm',
  components: { Form, Field },
  setup () {
    const isMsgLogin = ref(true)
    const loginForm = ref(null)
    // 1.定义表单数据对象
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })

    const store = useStore()
    // 路由对象
    const route = useRoute()
    const router = useRouter()

    // 2.定义表单校验规则
    const mySchema = {
      isAgree: schema.isAgree,
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code
    }
    // 3.清空表单和校验规则=>监听元素变化
    watch(isMsgLogin, () => {
      // 还原数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 补充校验效果清除，Form组件提供resetForm()
      loginForm.value.resetForm()
    })
    // 4.提交时，进行表单验证
    const login = async () => {
      let data = null
      try {
        const valid = await loginForm.value.validate()
        if (valid) {
          if (!isMsgLogin.value) {
            const { account, password } = form
            data = await userAccountLogin({ account, password })
          } else {
            const { mobile, code } = form
            data = await userMobileLogin({ mobile, code })
          }
          console.log(data.result)
          const { id, account, avatar, mobile, nickname, token } = data.result
          // 1.在vuex中存储数据
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 2.跳转至首页/原页面
          // console.log(route.query.redirectUrl)
          // 7.1.合并购物车
          store.dispatch('cart/mergeCart').then(() => {
            // 7.2.页面跳转
            router.push(route.query.redirectUrl || '/')
            // 7.3.登录成功信息
            Message({ type: 'success', text: 'QQ绑定成功' })
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
    // 5.定义倒计时函数
    const time = ref(0)
    // 使用useIntervalFn(回调函数，执行间隔，是否立即开启)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    // 6.发送验证码
    const sendCode = async () => {
      // 1.校验手机号格式
      const valid = mySchema.mobile(form.mobile)
      // 1.1.手机格式正确
      if (valid === true) {
        // 注意：还需判断倒计时是否为0！！！
        if (time.value === 0) {
        // 2.调用code的API
          await userMobileLoginMsg(form.mobile)
          // 3.将按钮变成倒计时
          Message({ type: 'success', text: '验证码发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 1.2.手机号校验失败，使用vee的setFieldError()发送错误提示
        loginForm.value.setFieldError('mobile', valid)
      }
    }
    // 创建QQ登录按钮
    // 注意：创建的QQ登录按钮，会打开新窗口实现页面跳转，所以自行创建QQ跳转按钮
    /*     onMounted(() => {
      QC.login({
        btnid:'qqLoginBtn'
      })
    }) */
    // 组件销毁，清除定时器
    onUnmounted(() => {
      pause()
    })
    return { isMsgLogin, form, schema: mySchema, loginForm, login, sendCode, time }
  }
}
</script>
<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
