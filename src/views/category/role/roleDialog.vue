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
import type { VoiceModel } from '@/model/voice'
import { addCharacter, putCharacter } from '@/api/character'
import { generateImage } from '@/api/video'

const props = defineProps({
  isAdd: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Object as PropType<CharacterModel>,
    default: () => ({}),
  },
  voiceList: {
    type: Array as PropType<VoiceModel[]>,
    default: () => [],
  },
})
const emit = defineEmits(['success'])
const category = useCategoryStore()
/**
 * 1-本地音频
 * 2-系统音色
 */
const voiceType = ref('1')
const file = ref<UploadUserFile[]>([])

const visible = defineModel({ type: Boolean, required: false })
const popoverWrap = useTemplateRef('popoverWrap')
const submitLoading = ref(false)
const popoverVisible = ref(false)
const popoverLoading = ref(false)
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const form = ref<CharacterModel>({})
const rules: FormRules = {
  characterName: [{ required: true, trigger: 'blur', message: '请输入音色名称' }],
  voiceId: [{ required: true, trigger: 'blur', message: '请选择音色' }],
  description: [{ required: true, trigger: 'blur', message: '请输入角色描述' }],
  voiceType: [{ required: true, trigger: 'blur', message: '请选择项目类别' }],
  projectId: [{ required: true, trigger: 'blur', message: '请选择项目名称' }],
  posterUrl: [{ required: true, trigger: 'blur', message: '请上传或生成角色图片' }],
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
  popoverVisible.value = false
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
      voiceName: props.voiceList.find(el => el.id === form.value.voiceId)?.voiceName,
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
  })
    .then((res) => {
      form.value.posterUrl = res.msg
      file.value = [{
        name: res.msg,
        url: res.msg,
      }]
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
        console.log(props.data, 'data')

        form.value = {
          ...props.data,
          voiceId: Number(props.data.voiceId),
        }
        file.value = [{
          name: props.data.posterUrl || '',
          url: props.data.posterUrl,
        }]
      }
      form.value.projectId = category.currentProject?.id
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
          <el-form-item label="项目类别" style="width: 100%">
            <el-select
              v-model="category.currentCategoryId"
              placeholder="请选择项目类别"
              disabled
            >
              <el-option
                v-for="item in category.categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id!"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectId" style="width: 100%">
            <el-select
              v-model="form.projectId"
              placeholder="请选择项目名称"
              disabled
            >
              <el-option
                v-for="item in category.videoProjectList"
                :key="item.id"
                :label="item.projectName"
                :value="item.id!"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="音色"
            style="width: 100%"
            prop="voiceId"
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
            >
              <el-option
                v-for="item in voiceList"
                :key="item.id"
                :label="item.voiceName"
                :value="item.id!"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
            label="角色描述"
            style="width: 100%"
            prop="description"
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

        <el-col :span="6">
          <el-form-item label="角色图片" style="width: 100%" prop="posterUrl">
            <div class="flex w-full items-center gap-[10px]">
              <UploadFile
                v-model:file-data="file"
                :limit="1"
                file-types="image"
                :show-file-list="false"
                @on-success="uploadFileSuccess"
              />
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <div ref="popoverWrap" class=" flex size-full justify-end items-center">
            <el-button
              type="primary"
              plain
              :loading="popoverLoading"
              @click="regenerate"
            >
              生成图片
            </el-button>
          </div>
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
