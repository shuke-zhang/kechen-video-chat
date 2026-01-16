<!-- userDialog.vue -->
<script setup lang="ts">
import type { ElForm, FormRules, UploadRequestOptions } from 'element-plus'
import type { DictDataCssModel } from '@/model/dict'
import type { VoiceArgsModel, VoiceModel } from '@/model/voice'
import { CircleCheck } from '@element-plus/icons-vue'
import { addVoice, getVoiceList, putVoice, putVoiceArgs, uploadAudio } from '@/api/voice'

const props = defineProps({
  isAdd: { type: Boolean, required: true },
  data: { type: Object, default: () => ({}) },
  sysUserSex: {
    type: Array as PropType<DictDataCssModel[]>,
    default: () => ([]),
  },
})
const emit = defineEmits(['success'])
const { age_voice_type } = useDict('age_voice_type')

const uploadRef = useTemplateRef('uploadRef')
const category = useCategoryStore()
/**
 * 1-本地音频
 * 2-系统音色
 */
const voiceType = ref('1')
console.log(category, 'category')
const systemVoiceLoading = ref(false)
const systemVoiceList = ref<VoiceModel[]>([])
const visible = defineModel({ type: Boolean, required: false })
const uploadPercent = ref(0)
const submitLoading = ref(false)
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const uploadLoading = ref(false)
const form = ref<VoiceModel>({
  voiceArgs: {
    pitch: 0,
    strength: 0,
    quality: 0,
  },
})
const lastGeneratedArgs = ref<VoiceArgsModel | null>(null)
const isLocalVoice = computed(() => voiceType.value === '1')
const rules: FormRules = {
  voiceName: [{ required: true, trigger: 'blur', message: '请输入音色名称' }],
  projectId: [{ required: true, trigger: 'blur', message: '请输入项目' }],
  voiceType: [{ required: true, trigger: 'blur', message: '请选择音色类别' }],

}
const marks = reactive({
  '-100': '-100',
  '0': '0',
  '100': '100',
})
// 是否需要重新生成
const needRegenerate = computed(() => {
  if (!lastGeneratedArgs.value || !form.value.voiceArgs)
    return true

  const cur = form.value.voiceArgs
  const last = lastGeneratedArgs.value

  return (
    cur.pitch !== last.pitch
    || cur.strength !== last.strength
    || cur.quality !== last.quality
  )
})
function cancel(): void {
  visible.value = false
  reset()
}

function reset(): void {
  form.value = {
    voiceArgs: {
      pitch: 0,
      strength: 0,
      quality: 0,
    },
  }
  resetForm(formRef.value)
  submitLoading.value = false
  voiceType.value = '1'
}

function submit(): void {
  formRef.value?.validate((valid) => {
    if (!valid)
      return
    if (submitLoading.value)
      return
    if (needRegenerate.value) {
      showMessageError('参数已修改，请先点击“重新生成”后再提交')
      return
    }

    submitLoading.value = true
    const api = props.isAdd ? addVoice : putVoice
    const data = {
      ...form.value,
      voiceArgs: JSON.stringify(form.value.voiceArgs) as VoiceArgsModel,
      voiceStatus: form.value.voiceStatus || 1,
    }
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

async function handleUploadAudio(option: UploadRequestOptions) {
  const { file } = option
  uploadLoading.value = true
  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await uploadAudio(formData)
    uploadPercent.value = 100
    form.value.testAudio = res.data.testAudio
    form.value.voiceId = res.data.voiceId
    uploadLoading.value = false
    uploadRef.value?.clearFiles()
  }
  catch (err) {
    uploadLoading.value = false
    console.log(err)
    uploadRef.value?.clearFiles()
  }
}

function beforeUpload(file: File) {
  const isAudio = file.type.includes('audio')
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isAudio) {
    ElMessage.error('只能上传音频文件')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('音频大小不能超过 10MB')
    return false
  }
  return true
}

function resetUpload() {
}

/**
 * 重新生成
 */
function regenerate() {
  putVoiceArgs({
    testAudio: form.value.testAudio || '',
    args: {
      pitch: form.value.voiceArgs?.pitch,
      quality: form.value.voiceArgs?.quality,
      strength: form.value.voiceArgs?.strength,
    },
  }).then((res) => {
    if (res.code === 0) {
      showMessageSuccess('生成成功！')
      form.value.testAudio = res.msg
      lastGeneratedArgs.value = {
        pitch: form.value.voiceArgs!.pitch,
        strength: form.value.voiceArgs!.strength,
        quality: form.value.voiceArgs!.quality,
      }
    }
  })
}

/**
 * 远程搜索系统音色
 */
function systemVoiceMethod() {
  if (systemVoiceLoading.value)
    return
  systemVoiceLoading.value = true
  getVoiceList({
    systemVoice: 0,
    page: {
      current: 1,
      size: 10000,
    },
  }).then((res) => {
    systemVoiceList.value = res.data.records
  }).finally(() => {
    systemVoiceLoading.value = false
  })
}

watch(() => visible.value, (val) => {
  if (val) {
    if (props.data.id) {
      form.value = {
        ...props.data,
        voiceType: `${props.data.voiceType}`,
        voiceArgs: props.data.voiceArgs ? JSON.parse(props.data.voiceArgs) : props.data.voiceArgs,
      }
    }
    form.value.projectId = category.currentProjectId
    // 初始化“最近生成参数”
    if (form.value.voiceArgs) {
      lastGeneratedArgs.value = {
        pitch: form.value.voiceArgs.pitch,
        strength: form.value.voiceArgs.strength,
        quality: form.value.voiceArgs.quality,
      }
    }
    else {
      lastGeneratedArgs.value = null
    }
  }
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="isAdd ? '新增音色' : '修改音色'"
    width="820"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form ref="formRef" :inline="true" :model="form" :rules="rules" class="large-form" label-width="120">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="音色名称" prop="voiceName" style="width: 100%">
            <el-input v-model="form.voiceName" clearable placeholder="请输入音色名称" size="large" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="项目" prop="projectId" style="width: 100%">
            <el-select v-model="form.projectId" placeholder="请选择项目" disabled>
              <el-option
                v-for="item in category.categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="上传方式" style="width: 100%">
            <el-radio-group v-model="voiceType" @change="form.testAudio = ''">
              <el-radio value="1" size="large">
                本地音频
              </el-radio>
              <el-radio value="2" size="large">
                系统音色
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="音色类别" prop="voiceType" style="width: 100%"
          >
            <el-select v-model="form.voiceType" placeholder="请选择音色类别">
              <el-option
                v-for="item in age_voice_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col v-if="!isLocalVoice" :span="24">
          <el-form-item
            label="系统音色" style="width: 100%" prop="testAudio"
            :rules="{
              required: true,
              message: '请选择系统音色',
            }"
          >
            <div class="flex w-full items-center  justify-between gap-[16px]">
              <el-select
                v-model="form.testAudio"
                filterable
                remote
                reserve-keyword
                placeholder="请选择系统音色"
                :remote-method="systemVoiceMethod"
                :loading="systemVoiceLoading"
              >
                <el-option
                  v-for="item in systemVoiceList"
                  :key="item.testAudio"
                  :label="item.voiceName"
                  :value="item.testAudio!"
                />
              </el-select>

              <div class="flex  items-center gap-[16px]">
                <el-icon v-if="form.testAudio" color="#67C23A">
                  <CircleCheck />
                </el-icon>
                <audio
                  :src="form.testAudio"
                  controls
                  style="flex:1;height: 32px;"
                />
                <el-button size="small" type="primary" :disabled="!form.testAudio" @click="regenerate">
                  重新生成
                </el-button>
              </div>
            </div>
          </el-form-item>
        </el-col>

        <!-- 上传区域 -->
        <el-col v-if="isLocalVoice" :span="24">
          <el-form-item
            label="上传音色"
            :rules="{
              required: true,
              message: '请上传音频',
            }"
          >
            <div class="flex items-center gap-[16px]">
              <el-upload
                ref="uploadRef"
                :show-file-list="false"
                :http-request="handleUploadAudio"
                :before-upload="beforeUpload"
                :limit="1"
                accept=".mp3,.wav"
                :disabled="uploadLoading"
              >
                <el-button type="primary" :loading="uploadLoading" :disabled="uploadLoading">
                  上传音频
                </el-button>
                <template #tip>
                  <!-- <div class="text-[10px] text-red-500">
                    支持 MP3 / WAV 格式
                  </div> -->
                </template>
              </el-upload>

              <el-icon v-if="form.testAudio" color="#67C23A">
                <CircleCheck />
              </el-icon>
              <audio
                :src="form.testAudio"
                controls
                style="flex:1;height: 32px;"
              />
              <el-button v-if="form.testAudio" size="small" @click="resetUpload">
                重新上传
              </el-button>

              <el-button size="small" type="primary" :disabled="!form.testAudio" @click="regenerate">
                重新生成
              </el-button>
            </div>
          </el-form-item>
        </el-col>

        <el-col v-if="form.testAudio" :span="12">
          <el-form-item label="音量高低" class="w-full">
            <div class="w-[320px]">
              <el-slider
                v-model="form.voiceArgs!.pitch" :marks="marks" :min="-100" show-input
              />
            </div>
          </el-form-item>
        </el-col>

        <el-col v-if="form.testAudio" :span="12">
          <el-form-item label="效果强度" class="w-full">
            <div class="w-[320px]">
              <el-slider v-model="form.voiceArgs!.strength" :min="-100" show-input :marks="marks" />
            </div>
          </el-form-item>
        </el-col>

        <el-col v-if="form.testAudio" :span="12">
          <el-form-item label="输出质量" class="w-full">
            <div class="w-[320px]">
              <el-slider v-model="form.voiceArgs!.quality" :min="-100" show-input :marks="marks" />
            </div>
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
  :deep(.el-slider__input) {
  width: 120px !important;
}
</style>
