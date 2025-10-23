<script setup lang="ts">
import type { ElForm, FormRules } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'
import type { UserModel } from '@/model/user'
import { PutUser } from '@/api/user'

const { userInfo, logout } = useUserStore()

const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const form = ref<UserModel>({})
const submitLoading = ref(false)
const rules: FormRules = {
  name: [{ required: true, trigger: 'blur', message: '请输入用户名称' }],
  password: [
    { required: true, trigger: 'blur', message: '请输入密码' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
  departName: [{ required: true, trigger: 'blur', message: '请输入部门名称' }],
  departHis: [{ required: true, trigger: 'blur', message: '请输入科室编号' }],
}

function submit() {
  let fullLoading: LoadingInstance | null = null

  formRef.value?.validate((valid) => {
    if (!valid)
      return

    if (submitLoading.value)
      return
    submitLoading.value = true

    PutUser({ ...form.value })
      .then(() => {
        // ✅ 使用 ElMessage，非阻塞提示
        return showMessageWarning('修改成功，即将退出登录!')
      })
      .then(() => {
        fullLoading = ElLoading.service({
          lock: true,
          text: '正在退出登录...',
          background: 'rgba(0, 0, 0, 0.7)',
        })

        return logout()
      })
      .finally(() => {
        if (fullLoading) {
          fullLoading.close()
        }
        submitLoading.value = false
      })
  })
}

onMounted(() => {
  form.value = {
    ...userInfo,
  }
})
</script>

<template>
  <div class="h-[500px]">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="card p-0">
          <div
            class="h-[40px] flex items-center pl-[20px] border-b-[1px] border-[#e7eaec]"
          >
            基本资料
          </div>
          <div class="p-[20px]">
            <el-form ref="formRef" label-width="100" :model="form" :rules="rules">
              <el-form-item label="用户名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入用户名称" />
              </el-form-item>

              <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" placeholder="请输入用户密码" type="password" show-password />
              </el-form-item>

              <el-form-item label="部门" prop="departName">
                <el-input v-model="form.departName" placeholder="请输入部门名称" />
              </el-form-item>

              <el-form-item label="科室编号" prop="departHis">
                <el-input v-model="form.departHis" placeholder="请输入科室编号" />
              </el-form-item>

              <div class="w-full flex justify-end">
                <el-button type="primary" :loading="submitLoading" @click="submit">
                  保存
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.list-group-item {
  border-bottom: 1px solid #e7eaec;
  border-top: 1px solid #e7eaec;
  margin-bottom: -1px;
  padding: 11px 0;
  font-size: 13px;
}
.list-group-item + .list-group-item {
  border-top: none;
}
</style>
