<script setup lang="ts">
import type { registerFormModel } from '@/model/register'

const route = useRoute()

const registerRef = useTemplateRef('registerFormRef')
const registerForm = ref<registerFormModel>({
  phone: '',
  password: '',
  newPasswordTwo: '',
  code: '',
})
const countdown = ref(0)
const sending = ref(false)
let timer: number | null = null
const registerRules = {
  newPasswordTwo: [{ required: true, trigger: 'blur', message: '请输入您的确认密码' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  phone: [{ required: true, trigger: 'blur', message: '请输入您的手机号' }],
}
const loading = ref(false)

/** 注册开关 */
const redirect = ref<string | undefined>(undefined)

/**
 * 登录方法
 */
function handleRegister() {
  registerRef.value?.validate((valid) => {
    if (valid) {
      // loading.value = true

    }
  })
}

function startCountdown(seconds: number) {
  countdown.value = seconds
  if (timer !== null) {
    window.clearInterval(timer)
    timer = null
  }
  timer = window.setInterval(() => {
    countdown.value = countdown.value - 1
    if (countdown.value <= 0) {
      if (timer !== null) {
        window.clearInterval(timer)
      }
      timer = null
    }
  }, 1000)
}

async function onSendCode() {
  if (sending.value || countdown.value > 0) {
    return
  }
  if (!validatePhoneReg.test(registerForm.value.phone)) {
    ElMessage.warning('请先输入有效的手机号')
    return
  }
  try {
    sending.value = true
    await fakeSendCodeApi(registerForm.value.phone as string)
    ElMessage.success('验证码已发送')
    startCountdown(60) // 60 秒倒计时
  }
  catch (_e) {
    ElMessage.error('发送失败，请稍后重试')
  }
  finally {
    sending.value = false
  }
}
async function fakeSendCodeApi(_account: string): Promise<void> {
  // 这里换成你的真实接口
  // await api.sendCode({ account })
}

watch(
  route,
  (newRoute) => {
    redirect.value = newRoute.query && (newRoute.query.redirect as string)
  },
  { immediate: true },
)

onMounted(() => {
})
</script>

<template>
  <div class="register-container h-[100vh] flex justify-center items-center  bg-cover">
    <el-form
      ref="registerFormRef"
      :model="registerForm"
      :rules="registerRules"
      class="z-[1] w-[500px] rounded-[6px] bg-white px-[25px] pt-[25px] pb-[5px]"
      label-position="left"
      size="large"
    >
      <h3 class="text-[#707070] mx-auto mb-[30px] text-center">
        注册账号
      </h3>

      <el-form-item prop="password">
        <el-input
          v-model="registerForm.password "
          type="password"
          size="large"
          auto-complete="off"
          show-password
          placeholder="请输入密码"
          @keyup.enter="handleRegister"
        >
          <template #prefix>
            <icon-font name="account-lock" class="el-input__icon input-icon" />
          </template>
        </el-input>
        <Password-strength :password="registerForm.password" />
      </el-form-item>

      <el-form-item prop="newPasswordTwo">
        <el-input
          v-model="registerForm.newPasswordTwo"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="请输入确认密码"
          show-password
          @keyup.enter="handleRegister"
        >
          <template #prefix>
            <icon-font name="account-lock" class="el-input__icon input-icon" />
          </template>
        </el-input>
        <Password-strength :password="registerForm.newPasswordTwo" />
      </el-form-item>

      <!-- <el-form-item prop="phone">
        <el-input
          v-model="registerForm.phone "
          type="text"
          size="large"
          :maxlength="11"
          placeholder="请输入手机号"
        >
          <template #prefix>
            <icon-font name="account-lock" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item> -->

      <!-- <el-form-item prop="code">
        <div class="w-full flex items-center justify-between">
          <el-input
            v-model="registerForm.code"
            type="text"
            size="large"
            auto-complete="off"
            placeholder="请输入验证码"
            show-password
            style="width: 240px;"
          >
            <template #prefix>
              <icon-font name="account-lock" class="el-input__icon input-icon" />
            </template>
          </el-input>
          <el-button
            type="primary"
            :disabled="countdown > 0 || sending"
            @click="onSendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </el-button>
        </div>
      </el-form-item> -->

      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width: 100%"
          @click="handleRegister"
        >
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div class="w-full flex justify-end">
          <router-link class="text-[#337ab7] hover:text-[rgb(32,160,255)] cursor-pointer focus:text-[#337ab7] text-[14px]" to="/login">
            已有账号？立即登录
          </router-link>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.el-input {
  height: 40px;
  input {
    height: 40px;
  }
}
.input-icon {
  height: 39px;
  width: 14px;
  margin-left: 0px;
}
.card {
  border-radius: 18px;
}

.register {
  padding: 20px 0;
  border: 1rpx solid red;
}

.register-container {
  background: linear-gradient(135deg, #f3eaff 0%, #e6f0ff 100%);
}
</style>
