<!-- VideoManagementTailwind.vue -->
<script setup lang="ts">
import type { ElForm } from 'element-plus'
import type { VideoModel } from '@/model/video'
import { CircleClose, CirclePlus, Refresh, Search } from '@element-plus/icons-vue'
import { DelVideo, getVideoList } from '@/api/video'
import { useAddVideo } from '@/stores'
import VideoDialog from './videoDialog.vue'

type MeasurableEl = HTMLElement | {
  getBoundingClientRect: () => DOMRect
  clientWidth: number
  clientHeight: number
}
const category = useCategoryStore()
const useAddVideoStore = useAddVideo()
const router = useRouter()
const route = useRoute()
const total = ref(0)
const loading = ref(false)
const isAdd = ref(false)
const isBatchDel = ref(false)
const visible = ref(false)
const currentData = ref<VideoModel>({})
const queryRef = ref<InstanceType<typeof ElForm> | null>(null)
const queryParams = ref<ListPageParamsWrapper<VideoModel>>({
  page: {
    current: 1,
    size: 10,
  },
})
const ids = ref<number[]>([])
const names = ref<string[]>([])
const triggerRefMap = ref<Record<string, MeasurableEl | undefined>>({})
const tooltipVisibleMap = ref<Record<string, boolean>>({})

/**
 * 设置对应的ref
 */
function setTriggerRef(id: string) {
  return (el: Element | ComponentPublicInstance | null): void => {
    if (el instanceof HTMLElement) {
      triggerRefMap.value[id] = el
      return
    }
    const root = (el as any)?.$el as HTMLElement | undefined
    if (root instanceof HTMLElement) {
      triggerRefMap.value[id] = root
      return
    }
    triggerRefMap.value[id] = undefined
  }
}

/* ---------------- Mock 数据 ---------------- */

const list = ref<VideoModel[]>([])

/**
 * 获取视频列表
 */
function getList() {
  if (loading.value)
    return
  loading.value = true
  getVideoList({
    ...queryParams.value,
    projectId: category.currentProject?.id,
  }).then(async (res) => {
    list.value = await Promise.all(
      res.data.records.map(async item => ({
        ...item,
        isDelChecked: false,
        coverUrl: item.videoUrl
          ? await getVideoFirstFrame(item.videoUrl)
          : '',
      })),
    )

    total.value = res.data.total
  }).finally(() => {
    loading.value = false
  })
}

function checkChange() {
  if (!isBatchDel.value) {
    // 取消批量删除，清空已选
    ids.value = []
    names.value = []
    list.value.forEach((it) => {
      it.isDelChecked = false
    })
  }
  else {
    showMessageInfo('点击卡片选中后，点击删除按钮可删除选中视频')
  }
}

/**
 * 批量删除模式选选中
 */
function activeCard(it: VideoModel) {
  if (!isBatchDel.value)
    return
  it.isDelChecked = !it.isDelChecked
  if (it.isDelChecked) {
    ids.value.push(it.id!)
    names.value.push(it.videoName!)
  }
  else {
    ids.value = ids.value.filter(id => id !== it.id)
    names.value = names.value.filter(name => name !== it.videoName)
  }
}

function handleDel(_ids: number[] | VideoModel) {
  const delIds = Array.isArray(_ids) ? _ids : [_ids.id!]
  if (delIds.length === 0)
    return
  const delNames = Array.isArray(_ids) ? names.value : [_ids.videoName!]
  confirmWarning(`是否确认删除视频：${delNames.join(', ')}？`).then(() => {
    delMsgLoading(DelVideo(delIds), '正在删除...').then(() => {
      showMessageSuccess('删除成功')
      ids.value = []
      names.value = []
      console.log(ids.value, 'ids.value')

      getList()
    })
  })
}

function retQuery() {
  queryParams.value = {
    page: {
      current: 1,
      size: 10,
    },
  }
  resetForm(queryRef.value)
  getList()
}

function handleVideoAdd() {
  useAddVideoStore.isAdd = true
  useAddVideoStore.currentData = currentData.value
  router.push({
    path: `/category/project/addVideo/${route.params.id}`,

  })
}

function openEdit(row: VideoModel) {
  useAddVideoStore.isAdd = false
  useAddVideoStore.currentData = row
  router.push({
    path: `/category/project/addVideo/${route.params.id}`,
  })
}

/* ---------------- 预览 ---------------- */
const previewVisible = ref(false)
const current = ref<VideoModel | null>(null)
function preview(v: VideoModel) {
  current.value = v
  previewVisible.value = true
}

/* ---------------- 工具 ---------------- */
function fmtDuration(sec: number) {
  const m = Math.floor(sec / 60).toString()
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function getVideoFirstFrame(videoUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')

    video.crossOrigin = 'anonymous'
    video.src = videoUrl
    video.muted = true
    video.playsInline = true

    video.addEventListener('loadeddata', () => {
      // 避免第一帧黑屏
      video.currentTime = 0.2
    })

    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas')

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0)

      const base64 = canvas.toDataURL('image/jpeg', 0.9)
      resolve(base64)
    })

    video.addEventListener('error', reject)
  })
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="app-container">
    <main class="h-full bg-slate-50 text-slate-900">
      <div class="flex flex-1 ">
        <el-form ref="queryRef" :inline="true" :model="queryParams" @submit.prevent>
          <el-form-item style="margin-bottom: 0;">
            <el-input
              v-model="queryParams.videoName"
              placeholder="请输入视频名称"
              clearable
              style="width: 240px"
              @keyup.enter="getList"
            />
          </el-form-item>

          <el-form-item style="margin-bottom: 0;">
            <el-button type="primary" :icon="Search" @click="getList">
              查询
            </el-button>
            <el-button type="primary" plain :icon="Refresh" @click="retQuery">
              查询重置
            </el-button>
            <el-button type="success" :icon="CirclePlus" @click="handleVideoAdd">
              新增
            </el-button>

            <el-button type="danger" :icon="CircleClose" :disabled="ids.length === 0" @click="handleDel(ids)">
              删除
            </el-button>

            <el-checkbox v-model="isBatchDel" class="ml-[12px]" @change="checkChange">
              批量删除
            </el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <el-divider />
      <!-- 卡片区域 -->
      <div v-loading="loading" class="min-h-[200px]" element-loading-text="加载中...">
        <template v-if="!loading">
          <div v-if="list.length > 0" class="grid [grid-template-columns:repeat(auto-fit,320px)] justify-start gap-[10px] min-h-[200px]">
            <article
              v-for="it in list"
              :key="it.id"
              class="w-[300px] h-[240px] rounded-xl border border-slate-200  bg-white  overflow-hidden flex flex-col gap-10px"
              :class="{ 'cursor-pointer': isBatchDel, 'del-active': it.isDelChecked }"
              @click.prevent="activeCard(it)"
            >
              <!-- 固定缩略图区域，高度 180px -->
              <div class="relative w-full h-[150px] bg-slate-900 overflow-hidden">
                <img :src="it.coverUrl" class="absolute inset-0 w-full h-full object-cover">

                <!-- 视频类型 -->
                <div
                  class="absolute left-0 top-[10px] h-[22px] flex-center
                  rounded-tr rounded-br bg-gray-700/60
                  text-gray-100 text-[12px] px-2"
                >
                  {{ it.fileType }}
                </div>

                <!-- 播放按钮 -->
                <div class="absolute inset-0 m-auto h-10 w-10 rounded-full bg-white/90 text-slate-900 shadow grid place-items-center hover:scale-105 transition cursor-pointer" @click="preview(it)">
                  ▶
                </div>

                <!-- 时长 -->
                <span v-if="false" class="absolute right-2 bottom-2 rounded bg-black/70 text-white text-xs px-2">
                  {{ fmtDuration(Number(it.duration)) }}
                </span>
              </div>

              <!-- 信息区 -->
              <div class="flex-1 p-2 flex flex-col justify-between">
                <div class="flex items-center" :title="it.videoName">
                  <div class="text-sm font-semibold line-clamp-1">
                    {{ it.videoName }}
                  </div>
                  <el-tag :type="it.publishStatus ? 'danger' : 'success'" size="small" class="ml-[4px]">
                    {{ it.publishStatus ? '不公开' : '公开' }}
                  </el-tag>
                </div>

                <el-tooltip
                  v-model:visible="tooltipVisibleMap[it.id!]"
                  :content="it.videoText"
                  placement="bottom"
                  effect="light"
                  trigger="hover"
                  virtual-triggering
                  :virtual-ref="triggerRefMap[it.id!]"
                  append-to="body"
                />

                <!-- 触发源：用函数模板 ref 把当前元素放到 triggerRefMap -->
                <div
                  :ref="setTriggerRef(String(it.id))"
                  v-trunc="{ item: it, key: 'isTextTruncated' }"
                  class="text-xs h-[16px] m-[4px] line-clamp-1 cursor-pointer"
                >
                  视频文本：{{ it.videoText || '-' }}
                </div>

                <div class="flex items-center justify-between">
                  <div class="text-xs  mt-1">
                    {{ $formatDefaultDate(it.createdTime!) }}
                  </div>
                  <div class="gap-[4px]">
                    <el-button type="primary" plain size="small" @click.stop="openEdit(it)">
                      编辑
                    </el-button>
                    <el-button type="danger" plain size="small" @click.stop="handleDel(it)">
                      删除
                    </el-button>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <el-empty v-else description="暂无数据" />
        </template>
      </div>

      <!-- 预览弹窗 -->
      <el-dialog
        v-model="previewVisible"
        width="800px"
        align-center
        :destroy-on-close="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="video-preview-dialog"
      >
        <div class="relative bg-black rounded-2xl h-[500px]">
          <video
            v-if="current?.videoUrl"
            autoplay
            :src="current.videoUrl"
            controls
            class="w-full rounded-lg h-[500px]"
          />
        </div>
      </el-dialog>
    </main>

    <VideoDialog v-model="visible" :is-add="isAdd" :data="currentData" @success="getList" />
  </div>
</template>

<style scoped>
/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.zoom-enter-active,
.zoom-leave-active {
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}
.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.96);
  opacity: 0;
}

.del-active {
  border: 1px solid;
  border-color: red;
  scale: 0.95;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
}
</style>
