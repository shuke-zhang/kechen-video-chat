<script setup lang="ts">
import type { ElForm, FormRules } from 'element-plus'
import type { AddPredictResponse, AddPredictResponseData, importPredictModel, PredictModel } from '@/model/predict'
import { addPredict } from '@/api/predict'

const props = defineProps<{
  projectList: Array<importPredictModel>
  currentProjectName: string
}>()
const emit = defineEmits<{
  (e: 'success', list: AddPredictResponseData[]): void
}>()
const router = useRouter()
/**
 * 是否是单次
 * - true 预测时只需要传入其他家开始单价 - 并且不需要跳转只需要展示后端返回的预测的F值数字即可
 * - false 预测三个值都需要去哪不传入 - 并且预测成功后跳转到echarts页面
 */
const isSingle = ref(true)
const visible = defineModel<boolean>('visible', {
  type: Boolean,
  required: true,
})
const form = ref<PredictModel>({
  totalCount: __DEV__ ? 800 : 0,
  companionCount: __DEV__ ? 300 : 0,
  companionUnitRate: __DEV__ ? 3.64 : 0,
  otherRate: __DEV__ ? 1.02 : 0,
})
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const submitLoading = ref(false)

const rules: FormRules = {
  totalCount: [
    { required: true, message: '请输入总数', trigger: 'change' },
    { validator: validateTotalGtCompanion, trigger: 'change' },
  ],
  companionCount: [{ required: true, trigger: 'change', message: '请输入陪标家数' }],
  companionUnitRate: [{ required: true, trigger: 'change', message: '请输入陪标系数' }],
  otherCount: [{ required: true, trigger: 'change', message: '请输入其他数' }],
  otherRate: [{ required: true, trigger: 'change', message: '请输入其他家系数' }],
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
        reset()
        visible.value = false
        emit('success', res.data)
      }).finally(() => {
        submitLoading.value = false
      })
    }
  })
}

function reset() {
  form.value
    = {
      totalCount: __DEV__ ? 800 : 0,
      capPrice: __DEV__ ? 7.02 : 0,
      companionCount: __DEV__ ? 300 : 0,
      companionUnitPrice: __DEV__ ? 3.64 : 0,
      otherStart: __DEV__ ? 1.02 : 0,
      otherStep: __DEV__ ? 0.05 : isSingle.value ? 0 : undefined,
      otherEnd: __DEV__ ? 3.02 : isSingle.value ? 0 : undefined,

    }
  resetForm(formRef.value)
  submitLoading.value = false
}

function _openResponseTabWithData(data: AddPredictResponse<AddPredictResponseData>) {
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

function removeAllPredictKeys(): void {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i += 1) {
    const k = localStorage.key(i)
    if (!k)
      continue
    if (k.startsWith('predict:response:'))
      keys.push(k)
  }
  for (const k of keys) {
    localStorage.removeItem(k)
  }
}

watch(() => props.projectList, (val) => {
  form.value.projectList = val
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

onMounted(() => {
  removeAllPredictKeys()
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
            label="陪标系数"
            prop="companionUnitRate"
          >
            <el-input-number
              v-model="form.companionUnitRate"
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
            label="其他家开始系数"
            prop="otherRate"
          >
            <el-input-number
              v-model="form.otherRate"
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
