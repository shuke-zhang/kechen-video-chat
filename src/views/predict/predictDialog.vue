<script setup lang="ts">
import type { ElForm } from 'element-plus'
import type { AddPredictResponse, AddPredictResponseData, importPredictModel, OpponentListModel, PredictModel } from '@/model/predict'
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
  companionProject: {
    opponentNumber: __DEV__ ? 1 : 0,
    upValue: __DEV__ ? 20 : 0,
    downValue: __DEV__ ? 10 : 0,
  },
  opponentList: [
    {
      name: '对手1',
      opponentNumber: __DEV__ ? 10 : 0,
      downValue: __DEV__ ? 10 : 0,
      upValue: __DEV__ ? 30 : 0,
    },
  ],
})
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const submitLoading = ref(false)

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
      const data: PredictModel = {
        ...form.value,
        companionProject: {
          ...form.value.companionProject,
          upValue: (form.value.companionProject?.upValue ?? 0) / 100,
          downValue: (form.value.companionProject?.downValue ?? 0) / 100,
        },
        opponentList: form.value.opponentList?.map((it) => {
          return {
            ...it,
            upValue: (it.upValue ?? 0) / 100,
            downValue: (it.downValue ?? 0) / 100,
          }
        }),
      }
      addPredict(data).then((res) => {
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
  form.value = {
    companionProject: {
      opponentNumber: __DEV__ ? 1 : 0,
      upValue: __DEV__ ? 10 : 0,
      downValue: __DEV__ ? 20 : 0,
    },
    opponentList: [
      {
        name: '对手1',
        opponentNumber: __DEV__ ? 10 : 0,
        upValue: __DEV__ ? 10 : 0,
        downValue: __DEV__ ? 30 : 0,
      },
    ],
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

function handleOpponentListAdd() {
  form.value.opponentList?.push({
    name: `对手${form.value.opponentList.length + 1}`,
    opponentNumber: __DEV__ ? (form.value.opponentList.length + 1) * 10 : 0,
    upValue: __DEV__ ? 30 : 0,
    downValue: __DEV__ ? 10 : 0,
  })
}

function handleOpponentListDel(item: OpponentListModel) {
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

watchEffect(() => {
  form.value.projectList = props.projectList
  form.value.projectName = props.currentProjectName
})

onMounted(() => {
  removeAllPredictKeys()
})
</script>

<template>
  <el-dialog
    v-model="visible"
    title="预测"
    width="1100"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form ref="formRef" :inline="true" :model="form" class="large-form" label-width="80">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-form-item label-position="right" label="自家的：" />
        </el-col>

        <el-col :span="7">
          <el-form-item
            label="陪标数量"
            :rules="[
              {
                required: true,
                message: '陪标数量不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <el-input-number
              v-model="form.companionProject!.opponentNumber"
              :min="0"
              :step="1"
              size="large"
              style="width: 100%;"
              controls-position="right"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item
            label="上浮值"
            :rules="[
              {
                required: true,
                message: '上浮值不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <el-input-number
              v-model="form.companionProject!.upValue"
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
            :rules="[
              {
                required: true,
                message: '下浮值不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <el-input-number
              v-model="form.companionProject!.downValue"
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
            <el-button type="success" plain class="h-full flex items-end" @click="handleOpponentListAdd">
              新增对手
            </el-button>
          </el-form-item>
        </el-col>

        <template v-for="(item, index) in form.opponentList" :key="item.name">
          <el-col :span="2">
            <el-form-item label-position="right" :label="`${item.name}：`" />
          </el-col>

          <el-col :span="7">
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
                :step="1"
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

        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          提 交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
</style>
