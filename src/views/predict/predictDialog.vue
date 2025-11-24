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
    floatValue: 0,
    opponentNumber: 200,
    upValue: 30,
    downValue: 30,
  },
  opponentList: [
    {
      name: '对手1',
      opponentNumber: 200,
      downValue: 30,
      upValue: 30,
    },
  ],
})
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const submitLoading = ref(false)

function cancel() {
  visible.value = false
  reset()
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
      floatValue: 0,
      opponentNumber: 200,
      upValue: 30,
      downValue: 30,
    },
    opponentList: [
      {
        name: '对手1',
        opponentNumber: 200,
        upValue: 30,
        downValue: 30,
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
    floatValue: 0,
    name: `对手${form.value.opponentList.length + 1}`,
    opponentNumber: 200,
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
    width="1200"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form ref="formRef" :inline="true" :model="form" class="large-form" label-width="80">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-form-item label-position="right" label="自家的：" />
        </el-col>

        <el-col :span="4">
          <el-form-item>
            <el-switch
              v-model="form.companionProject!.floatValue"
              size="large"
              active-text="下浮"
              :active-value="1"
              :inactive-value="0"
              inactive-text="上浮"
            />
          </el-form-item>
        </el-col>

        <el-col :span="5">
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

        <el-col :span="5">
          <el-form-item
            label="起始值"
            :rules="[
              {
                required: true,
                message: '起始值不能为空',
                trigger: 'blur',
              },
            ]"
          >
            <el-input-number
              v-model="form.companionProject!.downValue"
              :min="0"
              :step="1"
              size="large"
              style="width: 100%;"
              controls-position="right"
            />
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item
            prop="companionProject.upValue"
            label="结束值"
            :rules="[
              { required: true, message: '结束值不能为空', trigger: 'blur' },
              {
                validator: (_, value, callback) => {
                  if (value < form.companionProject!.downValue!) {
                    console.log(value, form.companionProject!.downValue, '自家');

                    callback(new Error('结束值不能小于起始值'))
                  }
                  else {
                    callback()
                  }
                },
                trigger: 'blur',
              },
            ]"
          >
            <el-input-number
              v-model="form.companionProject!.upValue"
              :min="0"
              :step="1"
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

          <el-col :span="4">
            <el-form-item>
              <el-switch
                v-model="item.floatValue"
                size="large"
                active-text="下浮"
                :active-value="1"
                :inactive-value="0"
                inactive-text="上浮"
              />
            </el-form-item>
          </el-col>

          <el-col :span="5">
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

          <el-col :span="5">
            <el-form-item
              label="起始值"
              label-width="80"
              :prop="`opponentList.${index}.downValue`"
              :rules="[
                {
                  required: true,
                  message: '起始值不能为空',
                  trigger: 'blur',
                },
              ]"
            >
              <el-input-number
                v-model="item.downValue"
                :min="0"
                :step="1"
                size="large"
                style="width: 100%;"
                controls-position="right"
              />
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item
              label="结束值"
              label-width="80"
              :prop="`opponentList.${index}.upValue`"
              :rules="[
                { required: true, message: '结束值不能为空', trigger: 'blur' },
                {
                  validator: (_, value, callback) => {
                    if (value < item.downValue!) {
                      callback(new Error('结束值不能小于起始值'))
                    }
                    else {
                      callback()
                    }
                  },
                  trigger: ['blur', 'change'],
                },
              ]"
            >
              <el-input-number
                v-model="item.upValue"
                :min="0"
                :step="1"
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
