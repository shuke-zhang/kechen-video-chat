<script setup lang="ts">
import type { ElForm, UploadUserFile } from 'element-plus'
import type { CharacterModel } from '@/model/character'
import type { TextSplitPayload, VideoGenModel } from '@/model/video'
import { VideoPlay } from '@element-plus/icons-vue'
import { generateImage } from '@/api/video'
import { videoGen } from '@/api/videoMergeRecord'

interface TextSplitPayloadWithState
  extends VideoGenModel {
  file?: UploadUserFile[]
  submitLoading?: boolean
  imageGenerating?: boolean
  videoGenerating?: boolean
  videoUrl?: string
}

const props = defineProps<{
  data: TextSplitPayload[]
  characterList: CharacterModel[]
}>()

const emit = defineEmits<{
  (e: 'success', t: TextSplitPayload): void
}>()

const category = useCategoryStore()

const { video_gen_type } = useDict('video_gen_type')

const visible = defineModel<boolean>()

const formRef = ref<InstanceType<typeof ElForm> | null>(null)

const form = ref<{
  plot_image: TextSplitPayloadWithState[]
}>({
  plot_image: [],
})

/* ======================
 * 生命周期 / 回显
 * ====================== */

/* ======================
 * 操作方法
 * ====================== */
const videoPreviewVisible = ref(false)
const previewVideoUrl = ref<string>('')

function openVideoPreview(url?: string) {
  if (!url) {
    ElMessage.warning('暂无可预览的视频')
    return
  }
  previewVideoUrl.value = url
  videoPreviewVisible.value = true
}
function cancel() {
  visible.value = false
  form.value.plot_image = []
  formRef.value?.clearValidate()
}

/**
 * 生成场景图片（行级）
 */
function regenerate(index: number) {
  const item = form.value.plot_image[index]

  if (!item.textInfo?.plot?.trim()) {
    ElMessage.warning('请先填写分片场景内容')
    return
  }

  if (item.imageGenerating)
    return

  item.imageGenerating = true

  generateImage({
    mode: 2,
    text: item.textInfo?.plot,
  })
    .then((res) => {
      item.imageUrl = res.msg
      item.file = [{
        name: item.videoName ?? 'image',
        url: res.msg,
      }]
    })
    .finally(() => {
      item.imageGenerating = false
    })
}

/**
 * 生成视频（行级 + 回显）
 */
function submitRow(index: number) {
  const item = form.value.plot_image[index]

  if (item.imageGenerating) {
    ElMessage.warning('场景图片正在生成中，请等待完成后再生成视频')
    return
  }

  if (item.videoGenerating)
    return

  item.videoGenerating = true
  item.submitLoading = true

  videoGen([{
    videoName: item.videoName,
    characterName: item.characterName,
    // characterId: item.characterId,
    imageUrl: item.imageUrl,
    isMusic: item.isMusic,
    // genMode: item.genMode,
    genMode: 1,
    textInfo: JSON.stringify(item.textInfo) as any,
    projectId: category.currentProject?.id,
  }])
    .then((_res) => {
      const data = _res.data[0]

      /**
       * 假设后端返回：
       * res.videoUrl
       */
      item.videoUrl = data.video_url
      showMessageSuccess(`「${item.videoName}」视频生成成功`)
      // emit('success', item)
    })
    .finally(() => {
      item.videoGenerating = false
      item.submitLoading = false
    })
}

watch(
  () => visible.value,
  (val) => {
    if (!val || !props.data?.length)
      return

    form.value.plot_image = props.data.map(it => ({
      ...it,
      file: it.imageUrl
        ? [{ name: it.videoName ?? 'image', url: it.imageUrl }]
        : [],
      submitLoading: false,
      imageGenerating: false,
      videoGenerating: false,
      isMusic: 0,
      textInfo: it.textInfo,
    }))
  },
)
</script>

<template>
  <el-dialog
    v-model="visible"
    title="视频分镜编辑"
    width="1200px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    lock-scroll
    @close="cancel"
  >
    <el-scrollbar height="520px" wrap-style="overflow-x: hidden;">
      <div class="px-[8px]">
        <el-row :gutter="16">
          <el-col
            v-for="(item, index) in form.plot_image"
            :key="index"
            :span="24"
          >
            <el-card shadow="hover" class="mb-[8px]">
              <!-- 基础信息 -->
              <el-row :gutter="16">
                <el-col v-if="item.characterName" :span="6">
                  <el-form-item label="角色">
                    <el-select
                      v-model="item.characterName"
                      filterable
                      placeholder="请选择角色"
                    >
                      <el-option
                        v-for="el in characterList"
                        :key="el.id"
                        :label="el.characterName"
                        :value="el.characterName!"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="4.5">
                  <el-form-item label="背景音乐">
                    <el-switch
                      v-model="item.isMusic"
                      active-text="启用"
                      :active-value="1"
                      :inactive-value="0"
                      inactive-text="关闭"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item label="生成模式">
                    <el-select
                      v-model="item.genMode"
                      placeholder="生成模式"
                    >
                      <el-option
                        v-for="el in video_gen_type"
                        :key="el.value"
                        :label="el.label"
                        :value="el.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item label="场景图片">
                    <div class="flex items-center gap-[10px]">
                      <UploadFile
                        v-model:file-data="item.file"
                        :limit="1"
                        file-types="image"
                        :show-file-list="false"
                        width="80"
                        height="80"
                      />
                    </div>
                  </el-form-item>
                </el-col>

                <el-col :span="5.5">
                  <el-form-item label="生成视频">
                    <div
                      class="relative flex cursor-pointer items-center justify-center rounded border bg-black"
                      style="width: 120px; height: 70px;"
                      @click="openVideoPreview(item.videoUrl)"
                    >
                      <!-- 视频缩略帧 -->
                      <video
                        v-if="item.videoUrl"
                        :src="item.videoUrl"
                        muted
                        preload="metadata"
                        class="h-full w-full object-contain"
                      />

                      <!-- 无视频占位 -->
                      <el-empty
                        v-else
                        description="暂无视频"
                        :image-size="10"
                        class="absolute inset-0 flex items-center justify-center"
                      />

                      <!-- ✅ 播放按钮（关键） -->
                      <div
                        v-if="item.videoUrl"
                        class="absolute inset-0 z-10 flex items-center justify-center bg-black/20"
                      >
                        <el-icon size="28" class="text-white drop-shadow">
                          <VideoPlay />
                        </el-icon>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="视频名称">
                    <el-input
                      v-model="item.videoName"
                      type="textarea"

                      :rows="6"
                      placeholder="请输入视频名称"
                    />
                  </el-form-item>
                </el-col>

                <!-- 文本 -->
                <el-col :span="8">
                  <el-form-item label="扩展描述">
                    <el-input
                      v-model="item.textInfo!.desc"
                      type="textarea"
                      :rows="6"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="分片场景">
                    <el-input
                      v-model="item.textInfo!.plot"
                      type="textarea"
                      :rows="6"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 视频预览 -->

              <!-- 操作 -->
              <div iv class="flex justify-end gap-[10px]">
                <el-button
                  type="primary"
                  plain
                  :loading="item.imageGenerating"
                  @click="regenerate(index)"
                >
                  生成图片
                </el-button>

                <el-button
                  type="primary"
                  :loading="item.videoGenerating"
                  :disabled="item.imageGenerating"
                  @click="submitRow(index)"
                >
                  {{
                    item.videoGenerating
                      ? '视频生成中...'
                      : item.videoUrl
                        ? '重新生成'
                        : '生成视频'
                  }}
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-scrollbar>

    <el-dialog
      v-model="videoPreviewVisible"
      title="视频预览"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="flex justify-center">
        <video
          :src="previewVideoUrl"
          controls
          autoplay
          class="w-full rounded"
          style="max-height: 450px;"
        />
      </div>
    </el-dialog>
  </el-dialog>
</template>

<style scoped lang="scss">
</style>
