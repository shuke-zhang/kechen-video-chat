<script setup lang="ts">
import type { CascaderOption, CascaderValue, ElForm, FormRules } from 'element-plus'
import type { CategoryModel } from '@/model/category'
import type { FileModel } from '@/model/file'
import { addFile, PutFile } from '@/api/file'
import Edit from './edit.vue'

const props = defineProps<{
  isAdd: boolean
  categoryList: CategoryModel[]
}>()
const emit = defineEmits<{
  (e: 'success'): void
}>()
const categoryList = computed(() => props.categoryList)
const visible = defineModel<boolean>('visible', {
  type: Boolean,
  required: true,
})
const form = ref<FileModel>({})
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const submitLoading = ref(false)
const isAdd = computed(() => {
  return props.isAdd
})
const rules: FormRules = {
  typeId: [{ required: true, trigger: 'change', message: '请选择类别名称' }],
  dictType: [{ required: true, trigger: 'blur', message: '请输入类别类型' }],
}

function cancel() {
  visible.value = false
}

function handleCascader(val: CascaderValue) {
  if (Array.isArray(val)) {
    console.log(val, 'val')
    form.value.typeId = val[val.length - 1] as number
    form.value.typeName = findNodeById(categoryList.value, form.value.typeId)?.name
  }
}

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (submitLoading.value)
        return
      submitLoading.value = true
      const api = isAdd.value ? addFile : PutFile
      const data = {
        id: form.value.id,
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
    :title="isAdd ? '新增文件' : '修改文件'"
    width="800"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form ref="formRef" :inline="true" :model="form" :rules="rules" class="large-form" label-width="100">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="类别名称" prop="typeId" style="width: 100%">
            <el-cascader
              v-model="form.typeId"
              :options="categoryList as CascaderOption[]"
              :props="{
                label: 'name',
                value: 'id',
                checkStrictly: true,
              }"
              size="large"
              style="width: 100%;"
              @change="handleCascader"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="文件链接" prop="dictType" style="width: 100%">
            <el-input v-model="form.name" placeholder="请输入文件链接" size="large" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="文件内容" prop="description" style="width: 100%">
            <Edit />
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
