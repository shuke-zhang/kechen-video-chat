<script setup lang="ts">
import type { ElForm, UploadUserFile } from 'element-plus'
import type { CharacterModel } from '@/model/character'
import type { TextSplitPayload, VideoGenModel } from '@/model/video'
import { generateImage } from '@/api/video'
import { videoGen } from '@/api/videoMergeRecord'

/* ======================
 * 类型扩展（前端状态）
 * ====================== */

interface TextSplitPayloadWithState
  extends VideoGenModel {
  file?: UploadUserFile[]
  submitLoading?: boolean
  imageGenerating?: boolean
  videoGenerating?: boolean
  videoUrl?: string // ⭐ 视频回显地址
}

const props = defineProps<{
  data: TextSplitPayload[]
  characterList: CharacterModel[]
}>()

const emit = defineEmits<{
  (e: 'success', t: TextSplitPayload): void
}>()

/* ======================
 * Props / Emits
 * ====================== */
const category = useCategoryStore()

const { video_gen_type } = useDict('video_gen_type')

const visible = defineModel<boolean>()

/* ======================
 * 表单状态
 * ====================== */

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

  if (!item.plot?.trim()) {
    ElMessage.warning('请先填写分片场景内容')
    return
  }

  if (item.imageGenerating)
    return

  item.imageGenerating = true

  generateImage({
    mode: 2,
    text: item.plot,
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
    imageUrl: item.imageUrl,
    isMusic: item.isMusic,
    // genMode: item.genMode,
    genMode: 1,
    textInfo: item.desc,
    projectId: category.currentProject?.id,
  }])
    .then((_res) => {
      /**
       * 假设后端返回：
       * res.videoUrl
       */
      // item.videoUrl = res.videoUrl
      ElMessage.success(`「${item.videoName}」视频生成成功`)
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
      plot: it.textInfo?.plot ?? '',
      desc: it.textInfo?.desc ?? '',
      words: it.textInfo?.talk?.words ?? '',
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
                <el-col :span="8">
                  <el-form-item label="视频名称">
                    <el-input
                      v-model="item.videoName"
                      type="textarea"
                      autosize
                      placeholder="请输入视频名称"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
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

                <el-col :span="4">
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

                <el-col :span="6">
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

                <el-col :span="6">
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
                      <el-button
                        type="primary"
                        plain
                        :loading="item.imageGenerating"
                        @click="regenerate(index)"
                      >
                        生成图片
                      </el-button>
                    </div>
                  </el-form-item>
                </el-col>

                <!-- 文本 -->
                <el-col :span="12">
                  <el-form-item label="扩展描述">
                    <el-input
                      v-model="item.desc"
                      type="textarea"
                      autosize
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="分片场景">
                    <el-input
                      v-model="item.plot"
                      type="textarea"
                      autosize
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 视频预览 -->
              <div v-if="item.videoUrl" class="mt-3">
                <video
                  :src="item.videoUrl"
                  controls
                  preload="metadata"
                  class="w-full rounded border"
                  style="max-height: 260px;"
                />
              </div>

              <!-- 操作 -->
              <div class="flex justify-end mt-3">
                <el-button
                  type="primary"
                  :loading="item.videoGenerating"
                  :disabled="item.imageGenerating"
                  @click="submitRow(index)"
                >
                  {{ item.videoGenerating ? '视频生成中...' : '生成视频' }}
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<style scoped lang="scss">
</style>
