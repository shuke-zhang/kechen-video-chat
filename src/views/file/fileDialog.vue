<script setup lang="ts">
import type { CascaderOption, CascaderValue, ElForm, FormRules } from 'element-plus'
import type { UploadFileResponseModel } from '@/components/UploadFile/types'
import type { CategoryModel } from '@/model/category'
import type { FileModel } from '@/model/file'
import { QuestionFilled } from '@element-plus/icons-vue'
import { addFile, PutFile } from '@/api/file'
import { categoryList2 } from './const'

const props = defineProps<{
  isAdd: boolean
  categoryList: CategoryModel[]
  currentRow: CategoryModel
}>()
const emit = defineEmits<{
  (e: 'success'): void
}>()
const cascaderRef = useTemplateRef('cascader')
const categoryList = computed(() => props.categoryList)
const visible = defineModel<boolean>('visible', {
  type: Boolean,
  required: true,
})
const form = ref<FileModel>({
  fileType: 0,
})
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const submitLoading = ref(false)
const isAdd = computed(() => {
  return props.isAdd
})
const isFileUpload = computed(() => form.value.fileType === 0)
const rules: FormRules = {
  typeId: [{ required: true, trigger: 'change', message: '请选择类别名称' }],
  fileType: [{ required: true, trigger: 'change', message: '请选择文件方式' }],
  fileExt: [{ required: true, trigger: 'change', message: '请选择文件类型' }],
  fileLink: [{ required: true, trigger: 'blur', message: '请输入文件链接' }],
  name: [{ required: true, trigger: 'blur', message: '请输入文件名称' }],
  fileContent: [{ required: true, trigger: 'blur', message: '请输入文件内容' }],
}

function cancel() {
  visible.value = false
}

function handleCoverUrlSuccess(val: {
  response: ResponseData<UploadFileResponseModel>
}) {
  const data = val.response.data
  form.value.fileLink = data.relativePath
  form.value.fileExt = data.fileExtension
  form.value.name = data.originalName
  form.value.newName = data.currentName
}

function handleCascader(val: CascaderValue | null | undefined) {
  if (Array.isArray(val)) {
    form.value.typeId = val[val.length - 1] as number
    const _name = findNodeById(categoryList.value, form.value.typeId)?.name
    form.value.typeName = _name

    if (form.value.fileType === 1) {
      form.value.name = _name
    }
  }
  cascaderRef.value?.togglePopperVisible(false)
}

function handleSwitch() {
  form.value.fileContent = ''
  form.value.fileExt = ''
  form.value.fileLink = ''
  form.value.fileSize = ''
  form.value.name = ''
  form.value.newName = ''
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
        fileContent: form.value.fileType === 0 ? undefined : form.value.fileContent,
        fileExt: form.value.fileExt,
        fileLink: form.value.fileLink,
        fileSize: form.value.fileSize,
        fileType: form.value.fileType,
        name: form.value.name,
        newName: form.value.newName,
        typeId: form.value.typeId,
        typeName: form.value.typeName,
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
  form.value = {
    fileType: 0,
  }
  resetForm(formRef.value)
  submitLoading.value = false
}
watch(() => props.currentRow, (val) => {
  form.value = toRaw(val)
}, {
  immediate: true,
  deep: true,
})
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
        <el-col :span="12">
          <el-form-item label="类别名称" prop="typeId" style="width: 100%">
            <el-cascader
              ref="cascader"
              v-model="form.typeId"
              :options="categoryList as CascaderOption[]"
              :props="{
                label: 'name',
                value: 'id',
                checkStrictly: true,
                expandTrigger: 'hover',
                checkOnClickNode: true,
              }"
              size="large"
              style="width: 100%;"
              @change="handleCascader"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="文件方式" prop="fileType" style="width: 100%">
            <el-switch v-model="form.fileType" active-text="文件上传" :active-value="0" :inactive-value="1" inactive-text="内容填写" @change="handleSwitch" />
          </el-form-item>
        </el-col>

        <el-col v-if="isFileUpload" :span="12">
          <el-form-item label="文件链接" prop="fileLink" style="width: 100%">
            <template #label>
              <span>
                <el-tooltip content="可手动输入文件链接，也可以上传文件自动获取" placement="top">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
                文件链接
              </span>
            </template>
            <div class="flex w-full flex-1 justify-between items-center">
              <el-input v-model="form.fileLink" placeholder="请输入文件链接" size="large" style="width: 160px; height: 40px;" />
              <UploadFile
                v-if="isFileUpload"
                :limit="1"
                mode="button"
                :file-types="['doc', 'docx']"
                @on-success="handleCoverUrlSuccess"
              />
            </div>
          </el-form-item>
        </el-col>

        <el-col v-if="!isFileUpload" :span="12">
          <el-form-item label="文件名称" prop="name" style="width: 100%">
            <el-input v-model="form.name" size="large" placeholder="请输入文件名称" />
          </el-form-item>
        </el-col>

        <el-col v-if="!isFileUpload" :span="24">
          <el-form-item label="文件内容" prop="fileContent" style="width: 100%">
            <el-input
              v-model="form.fileContent"
              :rows="2"
              type="textarea"
              placeholder="请输入文件内容"
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
