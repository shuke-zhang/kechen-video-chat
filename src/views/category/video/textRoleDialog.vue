<script setup lang="ts">
import type {
  ElForm,
  UploadUserFile,
} from 'element-plus'
import type { RoleFormItem, TextRolePayload } from '@/model/video'
import type { VoiceModel } from '@/model/voice'
import { addCharacter } from '@/api/character'
import { generateImage } from '@/api/video'

interface RoleFormItemWithState extends RoleFormItem {
  submitLoading?: boolean
  imageGenerating?: boolean
}

interface RoleForm {
  roles: RoleFormItemWithState[]
}

const props = defineProps<{
  data: TextRolePayload[]
  voiceList: VoiceModel[]
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

const form = ref<RoleForm>({
  roles: [],
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
      form.value.roles = props.data.map(it => ({
        ...it,
        voiceId: '',
        file: it.posterUrl
          ? [{ name: it.posterUrl, url: it.posterUrl }]
          : [],
        submitLoading: false,
        imageGenerating: false,
      }))
      console.log(form.value.roles, '内容')
    }
  },
)

/* ======================
 * 操作方法
 * ====================== */

function cancel() {
  visible.value = false
  form.value.roles = []
  formRef.value?.clearValidate()
}

/**
 * 单行提交
 */
function submitRow(index: number) {
  const role = form.value.roles[index]
  if (role.imageGenerating) {
    ElMessage.warning('角色图片正在生成中，请等待完成后再提交')
    return
  }
  if (!formRef.value)
    return

  const fields = [
    `roles.${index}.characterName`,
    `roles.${index}.voiceId`,
    `roles.${index}.file`,
    `roles.${index}.description`,
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
      form.value.roles.splice(index, 1)
      showMessageSuccess(`角色「${role.characterName}」提交成功`)
      if (form.value.roles.length === 0) {
        visible.value = false
      }
      emit('success', role)
    }
    finally {
      role.submitLoading = false
    }
  })
}

/**
 * 重新生成图片（仍然是全局 loading，符合你的原设计）
 */
function regenerate(index: number) {
  const role = form.value.roles[index]

  if (!role.description?.trim()) {
    ElMessage.error('请先填写角色描述')
    return
  }

  if (role.imageGenerating) {
    return
  }
  role.imageGenerating = true
  generateImage({
    mode: 2,
    text: role.description,
    topic: category.currentProject?.styleDesignId,
  })
    .then((res) => {
      role.file = [{
        name: res.msg,
        url: res.msg,
      }]
    })
    .finally(() => {
      role.imageGenerating = false
    })
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="修改角色"
    width="1200"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    @close="cancel"
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="110"
    >
      <el-row :gutter="20">
        <template
          v-for="(item, index) in form.roles"
          :key="index"
        >
          <!-- 角色名称 -->
          <el-col :span="6">
            <el-form-item
              :label="`角色信息-${index + 1}`"
              :prop="`roles.${index}.characterName`"
              :rules="[{ validator: validateRoleName, trigger: 'blur' }]"
            >
              <el-input
                v-model="item.characterName"
                placeholder="请输入角色名称"
                clearable
              />
            </el-form-item>
          </el-col>

          <!-- 音色 -->
          <el-col :span="4">
            <el-form-item
              label-width="0"
              style="width: 100%"
              :prop="`roles.${index}.voiceId`"
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

          <!-- 角色图片 -->
          <el-col :span="4">
            <el-form-item
              label-width="0"
              :prop="`roles.${index}.file`"
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
                  :loading="item.imageGenerating"
                  @click="regenerate(index)"
                >
                  重新生成
                </el-button>
              </div>
            </el-form-item>
          </el-col>

          <!-- 角色描述 -->
          <el-col :span="8">
            <el-form-item
              label-width="0"
              :prop="`roles.${index}.description`"
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
  </el-dialog>
</template>

<style scoped lang="scss">
</style>
