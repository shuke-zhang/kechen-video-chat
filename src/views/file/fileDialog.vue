<script setup lang="ts">
import type { ElForm, FormRules } from 'element-plus'
import type { DictModel } from '@/model/dict'
import { addDict, PutDict } from '@/api/dict'

const props = defineProps<{
  isAdd: boolean
}>()
const emit = defineEmits<{
  (e: 'success'): void
}>()
const visible = defineModel<boolean>('visible', {
  type: Boolean,
  required: true,
})
const form = ref<DictModel>({})
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const submitLoading = ref(false)
const isAdd = computed(() => {
  return props.isAdd
})
const rules: FormRules = {
  dictName: [{ required: true, trigger: 'change', message: '请输入类别名称' }],
  dictType: [{ required: true, trigger: 'blur', message: '请输入类别类型' }],
}
function cancel() {
  visible.value = false
}

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (submitLoading.value)
        return
      submitLoading.value = true
      const api = isAdd.value ? addDict : PutDict
      const data = {
        id: form.value.id,
        dictName: form.value.dictName,
        dictType: form.value.dictType,
        description: form.value.description,
      }
      api(data).then(() => {
        showMessageSuccess('操作成功')
        visible.value = false
        emit('success')
        reset()
      }).finally(() => {
        submitLoading.value = false
      })
    }
  })
}

function reset() {
  form.value = {}
  resetForm(formRef.value)
  submitLoading.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="isAdd ? '新增类别' : '修改类别'"
    width="500"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form ref="formRef" :inline="true" :model="form" :rules="rules" class="large-form" label-width="100">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="类别名称" prop="dictName" style="width: 100%">
            <el-input v-model="form.dictName" placeholder="请输入类别名称" size="large" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="类别类型" prop="dictType" style="width: 100%">
            <el-input v-model="form.dictType" placeholder="请输入类别类型" size="large" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="描述" prop="description" style="width: 100%">
            <el-input
              v-model="form.description"
              style="width: 240px"
              type="textarea"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">
          取 消
        </el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          提 交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
</style>
