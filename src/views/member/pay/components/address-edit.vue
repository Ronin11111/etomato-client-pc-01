<template>
  <XtxDialog :title="`${form.id?'修改':'添加'}收货地址`" v-model:visible="visible">
    <div class="address-edit">
      <div class="xtx-form">
      <div class="xtx-form-item">
        <div class="label">收货人：</div>
        <div class="field">
          <input v-model="form.receiver" class="input" placeholder="请输入收货人" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">手机号：</div>
        <div class="field">
          <input v-model="form.contact" class="input" placeholder="请输入手机号" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地区：</div>
        <div class="field">
          <XtxCitySelect :fullAddress="form.fullLocation" @changeDate="dataChange" placeholder="请选择所在地区"/>
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">详细地址：</div>
        <div class="field">
          <input v-model="form.address" class="input" placeholder="请输入详细地址" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">邮政编码：</div>
        <div class="field">
          <input v-model="form.cityCode" class="input" placeholder="请输入邮政编码" />
        </div>
      </div>
      <div class="xtx-form-item">
        <div class="label">地址标签：</div>
        <div class="field">
          <input v-model="form.addressTags" class="input" placeholder="请输入地址标签" />
        </div>
      </div>
    </div>
    </div>
    <template v-slot:footer>
      <XtxButton @click="visible=false" type="gray" style="margin-right:20px">取消</XtxButton>
      <XtxButton @click="submit" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { reactive, ref } from 'vue'
import { addAddress, editAddress } from '@/api/pay.js'
import Message from '@/components/library/message'
export default {
  name: 'AddressEdit',
  setup (props, { emit }) {
    const visible = ref(null)
    const open = (formDate) => {
      visible.value = true
      if (formDate) {
        // 修改地址
        for (const key in form) {
          form[key] = formDate[key]
        }
      } else {
        // 添加地址
        for (const key in form) {
          if (key === 'isDefault') {
            form[key] = 1
          } else {
            form[key] = null
          }
        }
      }
    }
    const form = reactive({
      id: '',
      receiver: '',
      contact: '',
      provinceCode: '',
      cityCode: '',
      countyCode: '',
      address: '',
      postalCode: '',
      addressTags: '',
      isDefault: 1,
      fullLocation: ''
    })
    const dataChange = (data) => {
      form.provinceCode = data.provinceCode
      form.cityCode = data.cityCode
      form.countyCode = data.countyCode
      form.fullLocation = data.fullLocation
    }
    // 表单提交事件
    const submit = () => {
      // 添加地址
      if (form.id) {
        // 修改地址
        editAddress(form).then(() => {
          Message({ type: 'success', text: '数据修改成功' })
          visible.value = false
          // 3.将数据追加在地址列表中
          emit('add-data', form)
        })
      } else {
        // 添加地址
        // 1.提交数据
        addAddress(form).then((data) => {
          form.id = data.result.id
          // 2.提示消息，关闭弹出层
          Message({ type: 'success', text: '数据添加成功' })
          visible.value = false
          // 3.将数据追加在地址列表中
          emit('add-data', form)
        })
      }
    }
    return { visible, open, form, dataChange, submit }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper){
    width: 580px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>
