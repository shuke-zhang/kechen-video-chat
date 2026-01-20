<!-- userDialog.vue -->
<script setup lang="ts">
import type {
  ElForm,
  FormRules,
  UploadFile,
  UploadFiles,
  UploadUserFile,
} from 'element-plus'
import type { UploadFileResponseModel } from '@/components/UploadFile/types'
import type { CharacterModel } from '@/model/character'
import type { DictDataCssModel } from '@/model/dict'
import type { VoiceModel } from '@/model/voice'
import { addCharacter, putCharacter } from '@/api/character'
import { generateImage } from '@/api/video'
import { getVoiceList } from '@/api/voice'

const props = defineProps({
  isAdd: { type: Boolean, required: true },
  data: { type: Object, default: () => ({}) },
  sysUserSex: {
    type: Array as PropType<DictDataCssModel[]>,
    default: () => [],
  },
})
const emit = defineEmits(['success'])
const { topic_type } = useDict('topic_type')
const category = useCategoryStore()
/**
 * 1-本地音频
 * 2-系统音色
 */
const voiceType = ref('1')
const file = ref<UploadUserFile[]>([])

const visible = defineModel({ type: Boolean, required: false })
const voiceLoading = ref(false)
const voiceList = ref<VoiceModel[]>([])
const submitLoading = ref(false)
const popoverVisible = ref(false)
const popoverLoading = ref(false)
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const form = ref<CharacterModel>({})
const rules: FormRules = {
  voiceName: [{ required: true, trigger: 'blur', message: '请输入音色名称' }],
  projectId: [{ required: true, trigger: 'blur', message: '请输入项目' }],
  voiceType: [{ required: true, trigger: 'blur', message: '请选择音色类别' }],
}

function cancel(): void {
  visible.value = false
  reset()
}

function reset(): void {
  form.value = {}
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
    const api = props.isAdd ? addCharacter : putCharacter
    const data = {
      ...form.value,
    }
    api(data)
      .then(() => {
        showLoadingMessageSuccess('操作成功')
        visible.value = false
        reset()
        emit('success')
      })
      .finally(() => {
        submitLoading.value = false
      })
  })
}

/**
 * 远程搜索系统音色
 */
function voiceMethod() {
  if (voiceLoading.value)
    return
  voiceLoading.value = true
  getVoiceList({
    page: {
      current: 1,
      size: 10000,
    },
  })
    .then((res) => {
      voiceList.value = res.data.records
    })
    .finally(() => {
      voiceLoading.value = false
    })
}

function regenerate() {
  if (popoverLoading.value)
    return

  if (!form.value?.description?.trim()) {
    return showMessageError('请先填写角色描述')
  }
  popoverLoading.value = true
  popoverVisible.value = false
  generateImage({
    mode: 2,
    text: form.value.description,
    topic: `${form.value.voiceId}`,
  })
    .then((res) => {
      form.value.posterUrl = res.msg
    })
    .finally(() => {
      popoverLoading.value = false
    })
}
function uploadFileSuccess({
  response,
}: {
  response: ResponseData<UploadFileResponseModel>
  uploadFile: UploadFile
  uploadFiles: UploadFiles
}) {
  form.value.posterUrl = response.data.accessPath
}

watch(
  () => visible.value,
  (val) => {
    if (val) {
      if (props.data.id) {
        form.value = {
          ...props.data,
        }
      }
      form.value.projectId = category.currentProjectId
      // 初始化“最近生成参数”
    }
  },
)
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="isAdd ? '新增音色' : '修改音色'"
    width="820"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      :rules="rules"
      class="large-form"
      label-width="80"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="角色名称"
            prop="characterName"
            style="width: 100%"
          >
            <el-input
              v-model="form.characterName"
              clearable
              placeholder="请输入音色名称"
              size="large"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="项目" prop="projectId" style="width: 100%">
            <el-select
              v-model="form.projectId"
              placeholder="请选择项目"
              disabled
            >
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
          <el-form-item
            label="系统音色"
            style="width: 100%"
            prop="testAudio"
            :rules="{
              required: true,
              message: '请选择音色',
            }"
          >
            <el-select
              v-model="form.voiceId"
              filterable
              remote
              reserve-keyword
              placeholder="请选择系统音色"
              :remote-method="voiceMethod"
              :loading="voiceLoading"
            >
              <el-option
                v-for="item in voiceList"
                :key="item.testAudio"
                :label="item.voiceName"
                :value="item.testAudio!"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="角色描述"
            style="width: 100%"
            prop="testAudio"
            :rules="{
              required: true,
              message: '请选择音色',
            }"
          >
            <el-input
              v-model="form.description"
              style="width: 240px"
              :rows="2"
              type="textarea"
              placeholder="请输入角色描述"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="角色图片" style="width: 100%" prop="testAudio">
            <div class="flex w-full items-center gap-[10px]">
              <UploadFile
                v-model:file-data="file"
                :limit="1"
                file-types="image"
                :show-file-list="false"
                @on-success="uploadFileSuccess"
              />
              <!-- <el-button type="primary" @click="regenerate">
                重新生成
              </el-button> -->

              <el-popover
                :visible="popoverVisible"
                placement="top"
                :width="220"
                popper-class="topic-popover"
              >
                <div class="popover-body gap-[10px]">
                  <el-select
                    v-model="form.voiceId"
                    remote
                    reserve-keyword
                    placeholder="请选择主题"
                    class="full-width"
                  >
                    <el-option
                      v-for="item in topic_type"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label!"
                    />
                  </el-select>

                  <div class="mt-[10px] flex justify-end">
                    <el-button size="small" @click="popoverVisible = false">
                      取消
                    </el-button>
                    <el-button type="primary" size="small" @click="regenerate">
                      确认
                    </el-button>
                  </div>
                </div>

                <template #reference>
                  <el-button
                    type="primary"
                    plain
                    :loading="popoverLoading"
                    @click="popoverVisible = true"
                  >
                    重新生成
                  </el-button>
                </template>
              </el-popover>
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
