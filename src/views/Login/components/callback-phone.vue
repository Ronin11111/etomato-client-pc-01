<template>
  <Form ref="loginForm" :validation-schema="schema" v-slot="{errors}" autocomplete="off" class="xtx-form">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field v-model="form.mobile" name="mobile" class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div :class="{error:errors.mobile}" v-if="errors.mobile">{{ errors.mobile }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field v-model="form.code" name="code" class="input" type="text" placeholder="短信验证码" />
        <span @click="sendCode" class="code">{{time===0?'发送验证码':`${time}秒`}}</span>
      </div>
      <div :class="{error:errors.code}" v-if="errors.code">{{ errors.code }}</div>
    </div>
    <a @click="QQlogin" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { ref, reactive } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/message'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'CallbackPhone',
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
    const loginForm = ref(null)
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    // 1.获取用户信息
    const nickname = ref(null)
    const avatar = ref(null)
    if (QC.Login.check()) {
      // 1.1.获取用户QQ信息
      QC.api('get_user_info').success((res) => {
        avatar.value = res.data.figureurl_qq_1
        nickname.value = res.data.nickname
      })
    }
    // 2.定义表单和校验规则
    const form = reactive({
      mobile: null,
      code: null
    })
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
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
          await userQQBindCode(form.mobile)
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
    const QQlogin = async () => {
      // 7.0.表单验证
      const valid = loginForm.value.validate()
      // console.log(valid)
      if (valid === true) {
        userQQBindLogin({ unionId: props.unionId, ...form }).then(data => {
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
    return { nickname, avatar, form, schema: mySchema, loginForm, sendCode, time, QQlogin }
  }
}
</script>

<style scoped lang='less'>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
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
