<script setup lang="ts">
import type { ElForm, FormRules } from 'element-plus'
import type { AddPredictResponse, AddPredictResponseData, importPredictModel, opponentListModel, PredictModel } from '@/model/predict'
import { addPredict } from '@/api/predict'

const props = defineProps<{
  projectList: Array<importPredictModel>
  currentProjectName: string
}>()
const emit = defineEmits<{
  (e: 'success', list: AddPredictResponseData[]): void
}>()
const router = useRouter()

const visible = defineModel<boolean>('visible', {
  type: Boolean,
  required: true,
})
const form = ref<PredictModel>({
  totalCount: __DEV__ ? 800 : 0,
  companionCount: __DEV__ ? 300 : 0,
  companionUnitRate: __DEV__ ? 3.64 : 0,
  otherRate: __DEV__ ? 1.02 : 0,
  opponentList: [
    {
      name: '对手1',
      opponentNumber: 0,
      upValue: 0,
      downValue: 0,
    },
  ],
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
      otherStep: __DEV__ ? 0.05 : 0,
      otherEnd: __DEV__ ? 3.02 : 0,

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

function handleOpponentListAdd() {
  form.value.opponentList?.push({
    name: `对手${form.value.opponentList.length + 1}`,
    opponentNumber: 0,
    upValue: 0,
    downValue: 0,
  })
}

function handleOpponentListDel(item: opponentListModel) {
  const index = form.value.opponentList!.indexOf(item)!
  if (index !== -1) {
    form.value.opponentList?.splice(index, 1)
    form.value.opponentList = form.value.opponentList?.map((item, index) => {
      return {
        ...item,
        name: `对手${index + 1}`,
      }
    })
  }
}

onMounted(() => {
  removeAllPredictKeys()
})
</script>

<template>
  <el-dialog
    v-model="visible"
    title="预测"
    width="1000"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form ref="formRef" :inline="true" :model="form" :rules="rules" class="large-form" label-width="100">
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
            label="其他家系数"
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

        <template v-for="(item, index) in form.opponentList" :key="item.name">
          <el-col :span="3">
            <el-form-item label-position="right" :label="`${item.name}：`" />
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="陪标数量"
              label-width="80"
              :prop="`opponentList.${index}.opponentNumber`"
              :rules="[
                {
                  required: true,
                  message: '陪标数量不能为空',
                  trigger: 'blur',
                },
              ]"
            >
              <el-input-number
                v-model="item.opponentNumber"
                :min="0"
                :step="0.01"
                size="large"
                style="width: 100%;"
                controls-position="right"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="上浮值"
              label-width="80"
              :prop="`opponentList.${index}.upValue`"
              :rules="[
                {
                  required: true,
                  message: '上浮值不能为空',
                  trigger: 'blur',
                },
              ]"
            >
              <el-input-number
                v-model="item.upValue"
                :min="0"
                :step="0.01"
                size="large"
                style="width: 100%;"
                controls-position="right"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="下浮值"
              label-width="80"
              :prop="`opponentList.${index}.downValue`"
              :rules="[
                {
                  required: true,
                  message: '下浮值不能为空',
                  trigger: 'blur',
                },
              ]"
            >
              <el-input-number
                v-model="item.downValue"
                :min="0"
                :step="0.01"
                size="large"
                style="width: 100%;"
                controls-position="right"
              />
            </el-form-item>
          </el-col>

          <el-col :span="3">
            <el-form-item>
              <el-button type="danger" plain class="h-full flex items-end" @click="handleOpponentListDel(item)">
                删除
              </el-button>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">
          取 消
        </el-button>

        <el-button @click="handleOpponentListAdd">
          新 增
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
