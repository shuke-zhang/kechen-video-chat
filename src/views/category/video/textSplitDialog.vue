<script setup lang="ts">
import type {
  ElForm,
  UploadUserFile,
} from 'element-plus'
import type { RoleFormItem, TextSplitPayload } from '@/model/video'
import { addCharacter } from '@/api/character'
import { generateImage } from '@/api/video'

const props = defineProps<{
  data: TextSplitPayload[]
}>()

const emit = defineEmits<{
  (e: 'success', t: RoleFormItem): void
}>()

/* ======================
 * Props / Emits
 * ====================== */
const category = useCategoryStore()

const visible = defineModel<boolean>()

/* ======================
 * 表单状态
 * ====================== */

const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const popoverLoading = ref(false)

const form = ref<{
  plot_image: TextSplitPayload[]
}>({
  plot_image: [],
})

/* ======================
 * 自定义校验
 * ====================== */

function validateRoleName(_rule: any, value: string, callback: (err?: Error) => void) {
  if (!value || !value.trim()) {
    callback(new Error('请输入角色名称'))
  }
  else {
    callback()
  }
}

function validateVoice(_rule: any, value: string, callback: (err?: Error) => void) {
  if (!value || !String(value).trim()) {
    callback(new Error('请选择音色'))
  }
  else {
    callback()
  }
}

function validateRoleDesc(_rule: any, value: string, callback: (err?: Error) => void) {
  if (!value || value.trim().length < 5) {
    callback(new Error('角色描述不少于 5 个字'))
  }
  else {
    callback()
  }
}

function validateRoleImage(_rule: any, value: UploadUserFile[], callback: (err?: Error) => void) {
  if (!value || value.length === 0 || !value[0]?.url) {
    callback(new Error('请上传或生成角色图片'))
  }
  else {
    callback()
  }
}

/* ======================
 * 生命周期 / 回显
 * ====================== */

watch(
  () => visible.value,
  (val) => {
    if (val && props.data?.length) {
      form.value.plot_image = props.data.map(it => ({
        ...it,
        voiceId: '',
        file: it.imageUrl
          ? [{ name: it.textInfo?.plot, url: it.textInfo?.plot }]
          : [],
        submitLoading: false,
      }))
    }
  },
)

/* ======================
 * 操作方法
 * ====================== */

function cancel() {
  visible.value = false
  form.value.plot_image = []
  formRef.value?.clearValidate()
}

/**
 * 单行提交
 */
function submitRow(index: number) {
  const role = form.value.plot_image[index]

  if (!formRef.value)
    return

  const fields = [
    `plot_image.${index}.characterName`,
    `plot_image.${index}.voiceId`,
    `plot_image.${index}.file`,
    `plot_image.${index}.description`,
  ]

  formRef.value.validateField(fields, async (valid) => {
    if (!valid)
      return

    role.submitLoading = true

    try {
      console.log('数据', {
        characterName: role.characterName,
        description: role.description,
        voiceId: Number(role.voiceId),
        posterUrl: role.file?.[0]?.url ?? '',
        voiceName: props.voiceList.find(el => el.id === Number(role.voiceId))?.voiceName,
      })

      await addCharacter({
        characterName: role.characterName,
        description: role.description,
        voiceId: Number(role.voiceId),
        posterUrl: role.file?.[0]?.url ?? '',
        projectId: category.currentProject?.id,
        voiceName: props.voiceList.find(el => el.id === Number(role.voiceId))?.voiceName,
      })
      form.value.plot_image.splice(index, 1)
      showMessageSuccess(`角色「${role.characterName}」提交成功`)
      emit('success', plot_image)
    }
    finally {
      role.submitLoading = false
    }
  })
}

/**
 * 重新生成图片
 */
function regenerate(index: number) {
  const role = form.value.plot_image[index]

  if (!role.description?.trim()) {
    ElMessage.error('请先填写角色描述')
    return
  }

  popoverLoading.value = true

  generateImage({
    mode: 2,
    text: role.description,
  })
    .then((res) => {
      role.file = [{
        name: res.msg,
        url: res.msg,
      }]
    })
    .finally(() => {
      popoverLoading.value = false
    })
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="修改视频"
    width="1200"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <el-scrollbar height="500px">
      <el-form
        ref="formRef"
        :model="form"
        label-width="110"
      >
        <el-row :gutter="20">
          <template
            v-for="(item, index) in form.plot_image"
            :key="index"
          >
            <!-- 视频名称 -->
            <el-col :span="12">
              <el-form-item
                :label="`信息-${index + 1}`"
                :prop="`plot_image.${index}.videoName`"
                :rules="[{ validator: validateRoleName, trigger: 'blur' }]"
              >
                <el-input
                  v-model="item.videoName"
                  placeholder="请输入视频名称"
                  clearable
                />
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item
                label-width="0"
                :prop="`plot_image.${index}.file`"
                :rules="[{ validator: validateRoleImage, trigger: 'change' }]"
              >
                <div class="flex items-center gap-[10px]">
                  <UploadFile
                    v-model:file-data="item.file"
                    :limit="1"
                    file-types="image"
                    :show-file-list="false"
                    width="60"
                    height="60"
                  />

                  <el-button
                    type="primary"
                    plain
                    :loading="popoverLoading"
                    @click="regenerate(index)"
                  >
                    重新生成
                  </el-button>
                </div>
              </el-form-item>
            </el-col>

            <!-- 音色 -->
            <el-col :span="4">
              <el-form-item
                label-width="0"
                style="width: 100%"
                :prop="`plot_image.${index}.voiceId`"
                :rules="[{ validator: validateVoice, trigger: 'blur' }]"
              >
                <el-select
                  v-model="item.voiceId"
                  filterable
                  placeholder="请选择音色"
                >
                  <el-option
                    v-for="el in voiceList"
                    :key="el.id"
                    :label="el.voiceName"
                    :value="el.id!"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <!-- 角色描述 -->
            <el-col :span="8">
              <el-form-item
                label-width="0"
                :prop="`plot_image.${index}.description`"
                :rules="[{ validator: validateRoleDesc, trigger: 'blur' }]"
              >
                <el-input
                  v-model="item.description"
                  type="textarea"
                  :rows="2"
                  autosize
                  placeholder="请输入角色描述"
                />
              </el-form-item>
            </el-col>

            <!-- 提交 -->
            <el-col :span="2" class="flex items-center">
              <el-button
                type="primary"
                :loading="item.submitLoading"
                @click="submitRow(index)"
              >
                提 交
              </el-button>
            </el-col>
          </template>
        </el-row>
      </el-form>
    </el-scrollbar>
  </el-dialog>
</template>

<style scoped lang="scss">
</style>
