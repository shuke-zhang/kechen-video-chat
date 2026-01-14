<!-- userDialog.vue -->
<script setup lang="ts">
import type { AxiosProgressEvent } from 'axios'
import type { ElForm, FormRules, UploadRequestOptions } from 'element-plus'
import type { DictDataCssModel } from '@/model/dict'
import type { VoiceModel } from '@/model/voice'
import { CircleCheck } from '@element-plus/icons-vue'
import { addVoice, putVoice, uploadAudio } from '@/api/voice'

const props = defineProps({
  isAdd: { type: Boolean, required: true },
  data: { type: Object, default: () => ({}) },
  sysUserSex: {
    type: Array as PropType<DictDataCssModel[]>,
    default: () => ([]),
  },
})
const emit = defineEmits(['success'])
const uploadRef = useTemplateRef('uploadRef')
const category = useCategoryStore()
/**
 * 1-本地音频
 * 2-系统音色
 */
const voiceType = ref('1')
console.log(category, 'category')

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
const isLocalVoice = computed(() => voiceType.value === '1')
const rules: FormRules = {
  voiceName: [{ required: true, trigger: 'blur', message: '请输入音色名称' }],
  sexDesc: [{ required: true, trigger: 'blur', message: '请选择性别' }],
  departName: [{ required: true, trigger: 'blur', message: '请输入所属科室名称' }],
  departHis: [{ required: true, trigger: 'blur', message: '请输入科室编号' }],
  password: [
    { required: true, trigger: 'blur', message: '请输入密码' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],

}
const marks = reactive({
  '-100': '-100',
  '0': '0',
  '100': '100',
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
    submitLoading.value = true
    const api = props.isAdd ? addVoice : putVoice
    const data = { ...form.value }
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

function onUploadProgress(e: AxiosProgressEvent) {
  if (e.total) {
    const percent = Math.round((e.loaded / e.total) * 100)
    uploadPercent.value = percent
  }
}

watch(() => visible.value, (val) => {
  if (val) {
    form.value.projectId = category.currentProjectId
  }
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="isAdd ? '新增用户' : '修改用户'"
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

        <el-col :span="24">
          <el-form-item label="上传方式" style="width: 100%">
            <el-radio-group v-model="voiceType">
              <el-radio value="1" size="large">
                本地音频
              </el-radio>
              <el-radio value="2" size="large">
                系统音色
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <!-- 音色选择 -->
        <el-col v-if="!isLocalVoice" :span="12">
          <el-form-item label="音色" prop="testAudio" style="width: 100%">
            <el-select v-model="form.testAudio" placeholder="请选择音色">
              <el-option
                v-for="item in category.categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 上传区域 -->
        <el-col v-if="isLocalVoice" :span="24">
          <el-form-item label="上传音色">
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
              <el-button size="small" @click="resetUpload">
                重新上传
              </el-button>
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="音量高低" class="w-full">
            <div class="w-[320px]">
              <el-slider
                v-model="form.voiceArgs!.pitch" :marks="marks" :min="-100" show-input
              />
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="效果强度" class="w-full">
            <div class="w-[320px]">
              <el-slider v-model="form.voiceArgs!.strength" :min="-100" show-input :marks="marks" />
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="12">
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
