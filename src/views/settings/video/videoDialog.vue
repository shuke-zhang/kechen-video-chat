<script setup lang="ts">
import type { ElForm } from 'element-plus'
import type DragUploadFile from '@/components/DragUploadFile/DragUploadFile.vue'
import type { UploadRow } from '@/model/upload'
import type { VideoModel } from '@/model/video'
import type { VideoCategoryModel } from '@/model/videoCategory'
import { addVideo, PutVideo } from '@/api/video'

const props = defineProps({
  isAdd: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Object,
  },
  videoTree: {
    type: Array as PropType<VideoCategoryModel[]>,
  },
})

const emit = defineEmits(['success'])

const visible = defineModel({ type: Boolean, required: false })
const submitLoading = ref(false)
const form = ref<VideoModel>({
})
const DragUploadFileRef = ref<InstanceType<typeof DragUploadFile> | null>(null)
const formRef = ref<InstanceType<typeof ElForm> | null>(null)

const uploadFile = ref<UploadRow | null>(null)

const rules = {
  name: [{ required: true, trigger: 'blur', message: '请输入视频名称' }],
  videoType: [{ required: true, trigger: 'blur', message: '请输入视频分类' }],
  address: [{ required: true, trigger: 'blur', message: '请输入视频链接地址' }],
  comment: [{ required: true, trigger: 'blur', message: '请输入视频简介' }],
  coverLink: [{ required: true, trigger: 'blur', message: '请上传视频封面' }],
}
function handleUploadSuccess(file: UploadRow) {
  console.log(file, 'file-success')

  if (file.status !== 'success')
    return
  form.value.address = file.response?.data.accessPath
  form.value.videoLength = String(file.response?.data.duration) || '0'
  form.value.fileType = file.response?.data.fileExtension
}

function copyAddress() {
  const url = form.value.address
  if (!url) {
    ElMessage.warning('视频地址为空，无法复制')
    return
  }
  copyText(url)
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
  form.value = {}
  resetForm(formRef.value)
  submitLoading.value = false
  uploadFile.value = null
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

watch(() => props.data, (newVal) => {
  if (newVal) {
    form.value = { ...newVal } as any
    console.log(form.value, 'form.value')
  }
})
watch(() => visible.value, () => {
  // 重置
  uploadFile.value = null
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
        <!-- 视频名称 -->
        <el-col :span="12">
          <el-form-item label="视频名称" prop="name" style="width: 100%">
            <el-input v-model="form.name" clearable placeholder="请输入视频名称" size="large" />
          </el-form-item>
        </el-col>

        <!-- 视频分类 -->
        <el-col :span="12">
          <el-form-item label="视频分类" prop="videoType" style="width: 100%">
            <el-tree-select
              v-model="form.videoType"
              :data="videoTree"
              :render-after-expand="false"
              :props="{
                label: 'name',
                value: 'id',
                children: 'children',
              }"
              style="width: 240px"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 视频链接地址 -->
        <el-col :span="24">
          <el-form-item label="视频地址" prop="address" style="width: 100%">
            <el-input v-model="form.address" clearable placeholder="请输入视频链接地址或上传视频自动获取地址" size="large" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 视频简介 -->
        <el-col :span="24">
          <el-form-item label="视频简介" prop="comment" style="width: 100%">
            <el-input
              v-model="form.comment"
              type="textarea"
              :rows="4"
              clearable
              placeholder="请输入视频简介"
            />
          </el-form-item>
        </el-col>
        <!-- 上传封面 -->
        <el-col :span="8">
          <el-form-item label="视频封面" prop="coverLink" style="width: 100%">
            <UploadFile
              v-model="form.coverLink"
              :limit="1"
              file-types="image"
              :show-file-list="false"
            />
            <div class="text-[10px] text-red-300">
              请尽量上传比例为2:1的封面图
            </div>
          </el-form-item>
        </el-col>

        <!-- 上传视频· -->
        <el-col :span="16">
          <el-form-item label="视频文件" prop="video" style="width: 100%">
            <div class="flex  items-center w-full">
              <div class="size-[140px]">
                <DragUploadFile ref="DragUploadFileRef" v-model:files="uploadFile" :limit="1" file-types="video" @success="handleUploadSuccess" />
              </div>

              <div class="ml-[10px] flex-1 ">
                <div class="flex items-center justify-between gap-2">
                  <div class="min-w-0 flex-1">
                    <!-- 前面省略，后面展示 -->
                    <div
                      v-trunc="{ lines: 1, titleWhenTruncated: true, observeMutations: true }"
                      class="w-[180px] overflow-hidden text-ellipsis whitespace-nowrap [direction:rtl] [text-align:left] "
                    >
                      {{ uploadFile?.name || '--' }}
                    </div>
                  </div>

                  <span class="shrink-0">
                    {{ uploadFile?.size || 0 }}
                  </span>
                </div>
                <el-progress
                  :key="uploadFile?.uid"
                  :text-inside="true"
                  :stroke-width="14"
                  :percentage="uploadFile?.progress"
                  status="success"
                />
                <div class="mt-2 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/80 px-3 py-2 text-sm text-blue-700 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-300">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.2)]" />
                    <span class="truncate text-xs">上传成功后自动填充视频地址
                    </span>
                  </div>
                  <el-button type="primary" size="small" class="ml-[5px]" plain @click="copyAddress">
                    复制
                  </el-button>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
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
