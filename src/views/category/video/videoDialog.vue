<script setup lang="ts">
import type { ElForm, UploadUserFile } from 'element-plus'
import type DragUploadFile from '@/components/DragUploadFile/DragUploadFile.vue'
import type { UploadRow } from '@/model/upload'
import type { VideoModel } from '@/model/video'
import type { VideoCategoryModel } from '@/model/videoCategory'
import { addVideo, PutVideo, textRole, textVideo } from '@/api/video'
import { useCategoryStore } from '@/stores'

const props = defineProps({
  isAdd: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Object as PropType<VideoModel>,
  },
  videoTree: {
    type: Array as PropType<VideoCategoryModel[]>,
  },
})

const emit = defineEmits(['success'])
const file = ref<UploadUserFile[]>([])
const category = useCategoryStore()
const textVideoLoading = ref(false)
const roleLoading = ref(false)
const visible = defineModel({ type: Boolean, required: false })
const submitLoading = ref(false)
const form = ref<VideoModel>({
  publishStatus: 0,
  videoText: '在天空的尽头，有一间小小的云朵裁缝铺。\n店主是一只年迈的白猫，名叫絮絮。它不缝衣服，而是用晨雾做线、晚霞当布，为伤心的人缝补破碎的梦。一天，一个小女孩坐在屋顶上哭泣。她的风筝断了线，飞进了乌云里，再也没回来。\n“那是妈妈最后送我的礼物……”她抽泣着说。絮絮轻轻跳上屋顶，从怀里掏出一团蓬松的云：“别怕，我帮你把它缝回来。”它用月光穿针，把星星缀在风筝的角上，又剪下一小片彩虹做尾巴。\n第二天清晨，小女孩睁开眼——那只风筝正轻轻落在她的窗台上，比从前更亮、更轻，仿佛能带人飞到任何想念的地方。\n\n从此，每当有人失落或难过，絮絮就会悄悄出现在他们梦里，问一句：\n“需要我为你缝点什么吗？”\n\n寓意：温柔与善意，能修补世间最细碎的遗憾。',
  videoName: '《云朵裁缝》',
})
const DragUploadFileRef = ref<InstanceType<typeof DragUploadFile> | null>(null)
const formRef = ref<InstanceType<typeof ElForm> | null>(null)

const uploadFile = ref<UploadRow | null>(null)

const rules = {
  videoName: [{ required: true, trigger: 'blur', message: '请输入视频名称' }],
  videoUrl: [{ required: true, trigger: 'blur', message: '请输入视频链接地址' }],
  publishStatus: [{ required: true, trigger: 'blur', message: '请选择是否公开' }],
  videoText: [{ required: true, trigger: 'blur', message: '请输入视频文本' }],
  coverUrl: [{ required: true, trigger: 'blur', message: '请上传视频封面' }],
}

function uploadAbort() {
  if (!uploadFile?.value?.uid)
    return
  DragUploadFileRef.value?.abortUpload(uploadFile?.value?.uid)
}

function cancel() {
  console.log('触发取消')
  visible.value = false
  reset()
}

function cancelConfirm() {
  confirmWarning('视频上传未完成，关闭后视频将取消上传。是否确认关闭？').then(() => {
    uploadAbort()
    cancel()
  })
}

function reset() {
  form.value = {
    publishStatus: 0,

  }
  resetForm(formRef.value)
  submitLoading.value = false
  uploadFile.value = null
  file.value = []
}

function submit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (submitLoading.value)
        return
      submitLoading.value = true
      const data: VideoModel = {
        ...form.value,
        videoTypeName: findNodeById<VideoCategoryModel>(props.videoTree!, form.value.videoType!)?.name,
      }
      console.log(data, 'submit')
      const api = props.isAdd ? addVideo : PutVideo
      api(data).then(() => {
        showMessageSuccess('操作成功')
        visible.value = false
        reset()
        // 触发父组件刷新
        emit('success')
      }).catch(() => {
        submitLoading.value = false
      })
    }
  })
}

function handleTextVideo() {
  if (textVideoLoading.value)
    return
  textVideoLoading.value = true
  console.log(category.currentProject, '内容')

  textVideo({
    projectId: category.currentProject?.id,
    publishStatus: form.value.publishStatus,
    videoName: form.value.videoName,
    videoText: form.value.videoText,
  }).finally(() => {
    textVideoLoading.value = false
  })
}

function handleRole() {
  if (roleLoading.value)
    return
  roleLoading.value = true
  textRole({
    projectId: category.currentProject?.id,
    publishStatus: form.value.publishStatus,
    videoName: form.value.videoName,
    videoText: form.value.videoText,
  }).then((res) => {
    if (res.data.add_role.length <= 0) {
      return showMessageSuccess('检测到已有角色，无须生成')
    }
    else {
      console.log(',,')
    }
  }).finally(() => {
    roleLoading.value = false
  })
}

watch(() => props.data, (newVal) => {
  if (newVal) {
    form.value = { ...newVal } as any

    console.log(form.value, 'form.value')
  }
})
watch(() => visible.value, (val) => {
  // 重置
  uploadFile.value = null
  if (val) {
    form.value.projectId = category.currentCategoryId
    file.value.push({
      name: props.data?.coverUrl || '',
      url: props.data?.coverUrl,
    })
  }
})

onMounted(() => {
  console.log(category.categoryList, 'category.categoryList')
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="isAdd ? '新增视频' : '修改视频'"
    width="800"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :before-close="uploadFile?.status === 'uploading' ? cancelConfirm : cancel"
  >
    <el-form
      ref="formRef"
      :inline="false"
      :rules="rules"
      :model="form"
      class="large-form"
      label-width="100"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="是否公开" prop="publishStatus">
            <el-switch
              v-model="form.publishStatus"
              active-text="公开"
              :active-value="1"
              inactive-text="不公开"
              :inactive-value="0"
            />
          </el-form-item>
        </el-col>

        <el-form-item label="文本标题" prop="videoName" style="width: 100%">
          <el-input
            v-model="form.videoName"
            type="textarea"
            :min-rows="2"
            clearable
            placeholder="请输入文本标题"
          />
        </el-form-item>

        <el-form-item label="内容" prop="videoText" style="width: 100%">
          <el-input
            v-model="form.videoText"
            type="textarea"
            :min-rows="6"
            autosize
            clearable
            placeholder="请输入文本标题"
          />
        </el-form-item>

        <el-form-item label="" class="w-full">
          <div class="w-full flex justify-end gap-[10px]">
            <el-button :loading="roleLoading" @click="handleRole">
              生成角色
            </el-button>
            <el-button :loading="textVideoLoading" @click="handleTextVideo">
              生成
            </el-button>
          </div>
        </el-form-item>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="uploadFile?.status === 'uploading' ? cancelConfirm() : cancel()">
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
.cover-uploader {
  width: 160px;
  height: 90px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.cover-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
</style>
