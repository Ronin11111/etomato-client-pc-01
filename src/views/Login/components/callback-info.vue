<template>
  <Form ref="loginForm" :validation-schema="mySchema" v-slot="{errors}" autocomplete="off" class="xtx-form">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field  v-model="form.account" name="account" :class="{err:errors.account}" class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div v-if="errors.account " :class="{error:errors.account }">{{ errors.account }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field v-model="form.mobile" name="mobile" :class="{err:errors.mobile}" class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div v-if="errors.mobile " :class="{error:errors.mobile }">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field v-model="form.code" name="code" :class="{err:errors.code}" class="input" type="text" placeholder="请输入验证码" />
        <span @click="sendCode" class="code">发送验证码</span>
      </div>
      <div v-if="errors.code " :class="{error:errors.code }">{{ errors.code }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field v-model="form.password" name="password" :class="{err:errors.password}" class="input" type="password" placeholder="请输入密码" />
      </div>
      <div v-if="errors.password" :class="{error:errors.password }">{{ errors.password }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field v-model="form.repassword" name="repassword" :class="{err:errors.repassword}" class="input" type="password" placeholder="请确认密码" />
      </div>
      <div v-if="errors.repassword" :class="{error:errors.repassword }">{{ errors.repassword }}</div>
    </div>
    <a @click="login" href="javascript:;" class="submit">立即提交</a>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate'
import { ref, reactive } from 'vue'
import schema from '@/utils/vee-validate'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/message'
import { userQQInfoCode, userQQInfoLogin } from '@/api/user'

export default {
  name: 'CallbackInfo',
  components: {
    Form, Field
  },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      repassword: null
    })
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code,
      account: schema.accountApi,
      password: schema.password,
      repassword: schema.repassword
    }
    const loginForm = ref(null)
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
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
          await userQQInfoCode(form.mobile)
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
    // 7.绑定QQ登录
    const login = async () => {
      // 7.0.表单验证
      const valid = loginForm.value.validate()
      // console.log(valid)
      if (valid === true) {
        userQQInfoLogin({ unionId: props.unionId, ...form }).then(data => {
          // 7.1.存储数据
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 7.2.页面跳转
          router.push(route.query.redirectUrl || '/')
          // 7.3.登录成功信息
          Message({ type: 'success', text: 'QQ绑定成功' })
        }).catch(e => {
          Message({ type: 'error', text: '登录失败' })
        })
      }
    }
    return { form, mySchema, loginForm, sendCode, login }
  }
}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
