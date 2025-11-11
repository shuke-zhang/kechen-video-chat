<script setup lang="ts">
import type { ElForm, FormRules } from 'element-plus'
import type { PredictModel } from '@/model/predict'
import { PutFile } from '@/api/file'

const props = defineProps<{
  currentRow: PredictModel
}>()
const emit = defineEmits<{
  (e: 'success'): void
}>()
const visible = defineModel<boolean>('visible', {
  type: Boolean,
  required: true,
})
const form = ref<PredictModel>({})
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const submitLoading = ref(false)

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

function handleSubmit() {
  console.log(form.value, '内容')

  formRef.value?.validate((valid) => {
    if (valid) {
      if (submitLoading.value)
        return
      submitLoading.value = true
      const api = PutFile
      const data = { }

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
  form.value = { }
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
    title="预测"
    width="800"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form ref="formRef" :inline="true" :model="form" :rules="rules" class="large-form" label-width="100">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="总家数"
            prop="totalVendors"
          >
            <el-input-number
              v-model="form.totalVendors"
              :min="1"
              :step="1"
              size="large"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="拦截价格"
            prop="interceptPrice"
          >
            <el-input-number
              v-model="form.interceptPrice"
              :min="0"
              :step="0.01"
              size="large"
              style="width: 100%;"
              controls-position="right"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="陪标家数"
            prop="companionVendors"
          >
            <el-input-number
              v-model="form.companionVendors"
              :min="0"
              :step="1"
              size="large"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="陪标单价"
            prop="companionUnitPrice"
          >
            <el-input-number
              v-model="form.companionUnitPrice"
              :min="0"
              :step="0.01"
              size="large"
              style="width: 100%;"
              controls-position="right"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="其他家预测值"
            prop="otherVendorsPredicted"
          >
            <el-input-number
              v-model="form.otherVendorsPredicted"
              :min="0"
              :step="1"
              size="large"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="其他家单价"
            prop="otherVendorsUnitPrice"
          >
            <el-input-number
              v-model="form.otherVendorsUnitPrice"
              :min="0"
              :step="0.01"
              size="large"
              style="width: 100%;"
              controls-position="right"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item
            label="单价上限"
            prop="unitPriceUpper"
          >
            <el-input-number
              v-model="form.unitPriceUpper"
              :min="0"
              :step="0.01"
              :max="2"
              size="large"
              style="width: 100%;"
              controls-position="right"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item
            label="单价下限"
            prop="unitPriceLower"
          >
            <el-input-number
              v-model="form.unitPriceLower"
              :min="0"
              :max="form.unitPriceUpper"
              :step="0.01"
              size="large"
              style="width: 100%;"
              controls-position="right"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item
            label="区间值"
            prop="unitPriceInterval"
          >
            <el-input-number
              v-model="form.unitPriceInterval"
              :min="0.01"
              :max="2"
              :step="0.01"
              size="large"
              style="width: 100%;"
              controls-position="right"
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
