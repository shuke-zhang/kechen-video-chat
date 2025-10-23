<!-- userDialog.vue -->
<script setup lang="ts">
import type { ElForm, FormRules } from 'element-plus'
import type { DictDataCssModel } from '@/model/dict'
import type { UserModel } from '@/model/user'
import { addUser, PutUser } from '@/api/user'

const props = defineProps({
  isAdd: { type: Boolean, required: true },
  data: { type: Object, default: () => ({}) },
  sysUserSex: {
    type: Array as PropType<DictDataCssModel[]>,
    default: () => ([]),
  },
})

const emit = defineEmits(['success'])

const visible = defineModel({ type: Boolean, required: false })

const submitLoading = ref(false)
const formRef = ref<InstanceType<typeof ElForm> | null>(null)

const form = ref<UserModel>({

})

const rules: FormRules = {
  name: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  sexDesc: [{ required: true, trigger: 'blur', message: '请选择性别' }],
  departName: [{ required: true, trigger: 'blur', message: '请输入所属科室名称' }],
  departHis: [{ required: true, trigger: 'blur', message: '请输入科室编号' }],
  password: [
    { required: true, trigger: 'blur', message: '请输入密码' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],

}

function cancel(): void {
  visible.value = false
  reset()
}

function reset(): void {
  form.value = {}
  resetForm(formRef.value)
  submitLoading.value = false
}

function submit(): void {
  formRef.value?.validate((valid) => {
    if (!valid)
      return
    if (submitLoading.value)
      return
    submitLoading.value = true
    const api = props.isAdd ? addUser : PutUser
    const data = { ...form.value }
    api(data).then(() => {
      showLoadingMessageSuccess('操作成功')
      visible.value = false
      reset()
      emit('success')
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

watch(
  () => props.data,
  (newVal) => {
    if (!newVal)
      return
    form.value = {
      ...newVal,
    }
    // 编辑场景：可选把密码校验去掉，或在 UI 隐藏密码项
  },
  { immediate: true },
)
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="isAdd ? '新增用户' : '修改用户'"
    width="820"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form ref="formRef" :inline="true" :model="form" :rules="rules" class="large-form" label-width="120">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="name" style="width: 100%">
            <el-input v-model="form.name" clearable placeholder="请输入用户名" size="large" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="所属科室名称" prop="departName" style="width: 100%">
            <el-input v-model="form.departName" clearable placeholder="请输入所属科室名称" size="large" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="科室编号" prop="departHis" style="width: 100%">
            <el-input v-model="form.departHis" clearable placeholder="请输入科室编号" size="large" />
          </el-form-item>
        </el-col>

        <el-col v-if="isAdd" :span="12">
          <el-form-item label="密码" prop="password" style="width: 100%">
            <el-input v-model="form.password" type="password" show-password placeholder="至少 6 位" size="large" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">
          取 消
        </el-button>
        <el-button type="primary" :loading="submitLoading" @click="submit">
          提 交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
</style>
