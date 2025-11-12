<script setup lang="ts">
import type { ElForm, FormRules } from 'element-plus'
import type { AddPredictResponseData, importPredictModel, PredictModel } from '@/model/predict'
import { addPredict } from '@/api/predict'

const props = defineProps<{
  currentRow: importPredictModel
  currentProjectName: string
}>()
const emit = defineEmits<{
  (e: 'success'): void
}>()
const router = useRouter()
const visible = defineModel<boolean>('visible', {
  type: Boolean,
  required: true,
})
const form = ref<PredictModel>({
  totalCount: __DEV__ ? 800 : 0,
  capPrice: __DEV__ ? 7.02 : 0,
  companionCount: __DEV__ ? 300 : 0,
  companionUnitPrice: __DEV__ ? 3.64 : 0,
  otherStart: __DEV__ ? 1.02 : 0,
  otherStep: __DEV__ ? 0.05 : 0,
  otherEnd: __DEV__ ? 3.02 : 0,
})
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const submitLoading = ref(false)

const rules: FormRules = {
  totalCount: [
    { required: true, message: '请输入总数', trigger: 'change' },
    { validator: validateTotalGtCompanion, trigger: 'change' },
  ],
  capPrice: [{ required: true, trigger: 'change', message: '请输入拦标价' }],
  companionCount: [{ required: true, trigger: 'change', message: '请输入陪标家数' }],
  companionUnitPrice: [{ required: true, trigger: 'change', message: '请输入陪标单价' }],
  otherCount: [{ required: true, trigger: 'change', message: '请输入其他数' }],
  otherStart: [{ required: true, trigger: 'change', message: '请输入其他家开始单价' }],
  otherEnd: [{ required: true, trigger: 'change', message: '请输入其他家结束单价' }],
  otherStep: [{ required: true, trigger: 'change', message: '请输入其他家区间单价' }],
}

function validateTotalGtCompanion(_: any, val: any, cb: (err?: Error) => void) {
  if (typeof val !== 'number' || Number.isNaN(val))
    return cb(new Error('请输入数字'))
  const cc = Number(form.value.companionCount ?? 0)
  if (val <= cc)
    return cb(new Error('总数必须大于陪标家数'))
  cb()
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

      addPredict({
        ...form.value,
      }).then((res) => {
        visible.value = false
        emit('success')
        reset()
        const data = res.data.resultData.map((item) => {
          return {
            ...item,
            originalName: form.value.projectName,
          }
        })
        confirmSuccess('操作成功！是否跳转到结果页面？').then(() => {
          openResponseTabWithData(data)
        })
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

function openResponseTabWithData(data: AddPredictResponseData[]) {
  const key = `predict:response:${Date.now()}:${Math.random().toString(36).slice(2)}`
  localStorage.setItem(key, JSON.stringify(data))
  // 先解析出完整 href，避免 hash/history 基础路径差异
  const href = router.resolve({ name: 'PredictResponse', query: { key } }).href
  // 先同步打开，避免被拦截
  const win = window.open(href, '_blank')
  if (!win) {
    ElMessage.error('浏览器拦截了新标签页，请允许弹出窗口')
  }
}
watch(() => props.currentRow, (val) => {
  form.value.code = val.code
  form.value.bqName = val.name
}, {
  immediate: true,
  deep: true,
})

watch(() => props.currentProjectName, (val) => {
  form.value.projectName = val
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
    <el-form ref="formRef" :inline="true" :model="form" :rules="rules" class="large-form" label-width="130">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="总数"
            prop="totalCount"
          >
            <el-input-number
              v-model="form.totalCount"
              :min="1"
              :step="1"
              size="large"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="拦标价"
            prop="capPrice"
          >
            <el-input-number
              v-model="form.capPrice"
              :min="1"
              :step="1"
              size="large"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="陪标家数"
            prop="companionCount"
          >
            <el-input-number
              v-model="form.companionCount"
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

        <!-- <el-col :span="12">
          <el-form-item
            label="其他家数"
            prop="otherCount"
          >
            <el-input-number
              v-model="form.otherCount"
              :min="0"
              :step="1"
              size="large"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col> -->

        <el-col :span="12">
          <el-form-item
            label="其他家开始单价"
            prop="otherStart"
          >
            <el-input-number
              v-model="form.otherStart"
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
            label="其他家区间单价"
            prop="otherStep"
          >
            <el-input-number
              v-model="form.otherStep"
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
            label="其他家结束单价"
            prop="otherEnd"
          >
            <el-input-number
              v-model="form.otherEnd"
              :min="0"
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
