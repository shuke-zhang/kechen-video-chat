<script setup lang="ts">
import type { LoginFormModel } from '@/model/login'

const title = import.meta.env.VITE_APP_TITLE
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const loginRef = useTemplateRef('loginFormRef')
const loginForm = ref<LoginFormModel>({
  name: 'admin',
  password: '123456',
})

const loginRules = {
  name: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
}
const loading = ref(false)

/** 注册开关 */
const register = ref(false)
const redirect = ref<string | undefined>(undefined)

/**
 * 登录方法
 */
function handleLogin() {
  loginRef.value?.validate((valid) => {
    if (valid) {
      loading.value = true

      userStore
        .login({
          name: loginForm.value.name,
          password: loginForm.value.password,
        })
        .then(() => {
          const query = route.query
          const otherQueryParams = Object.keys(query).reduce(
            (acc: { [key: string]: any }, cur) => {
              if (cur !== 'redirect') {
                acc[cur] = query[cur]
              }
              return acc
            },
            {},
          )
          router.push({ path: redirect.value || '/', query: otherQueryParams })
        })
        .catch(() => {
          loading.value = false
        })
    }
  })
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
  <div class="login-container h-[100vh] flex justify-center items-center  bg-cover">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="z-[1] w-[400px] rounded-[6px] bg-white px-[25px] pt-[25px] pb-[5px]"
    >
      <h3 class="text-[#707070] mx-auto mb-[30px] text-center">
        {{ title }}
      </h3>
      <el-form-item prop="name ">
        <el-input
          v-model="loginForm.name "
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix>
            <icon-font name="user" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          show-password
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <icon-font name="account-lock" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>

      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width: 100%"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div v-if="register" class="w-full flex justify-end ">
          <router-link class="text-[#337ab7] hover:text-[rgb(32,160,255)] cursor-pointer focus:text-[#337ab7]" to="/register">
            立即注册
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

.login {
  padding: 20px 0;
  border: 1rpx solid red;
}

.login-container {
  background: linear-gradient(135deg, #f3eaff 0%, #e6f0ff 100%);
}
</style>
