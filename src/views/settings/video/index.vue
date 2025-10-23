<!-- VideoManagementTailwind.vue -->
<script setup lang="ts">
import type { ElForm } from 'element-plus'
import type { VideoModel } from '@/model/video'
import type { VideoCategoryModel } from '@/model/videoCategory'
import { CircleClose, CirclePlus, Refresh, Search } from '@element-plus/icons-vue'
import { DelVideo, getVideoList } from '@/api/video'
import { getVideoCategoryTree } from '@/api/videoCategory'
import VideoDialog from './videoDialog.vue'

type MeasurableEl = HTMLElement | {
  getBoundingClientRect: () => DOMRect
  clientWidth: number
  clientHeight: number
}

const total = ref(0)
const loading = ref(false)
const videoTree = ref<VideoCategoryModel[]>([])
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

function getVideoTree() {
  getVideoCategoryTree().then((res) => {
    videoTree.value = res.data
  })
}

/**
 * 获取视频列表
 */
function getList() {
  if (loading.value)
    return
  loading.value = true
  getVideoList(queryParams.value).then((res) => {
    list.value = res.data.records.map(item => ({
      ...item,
      isDelChecked: false,
    }))
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
    names.value.push(it.name!)
  }
  else {
    ids.value = ids.value.filter(id => id !== it.id)
    names.value = names.value.filter(name => name !== it.name)
  }
}

function handleDel(_ids: number[] | VideoModel) {
  const delIds = Array.isArray(_ids) ? _ids : [_ids.id!]
  if (delIds.length === 0)
    return
  const delNames = Array.isArray(_ids) ? names.value : [_ids.name!]
  confirmWarning(`是否确认删除视频：${delNames.join(', ')}？`).then(() => {
    delMsgLoading(DelVideo(delIds), '正在删除...').then(() => {
      showMessageSuccess('删除成功')
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
  isAdd.value = true
  visible.value = true
}

function openEdit(row: VideoModel) {
  currentData.value = JSON.parse(JSON.stringify(row))
  isAdd.value = false
  visible.value = true
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

onMounted(() => {
  getList()
  getVideoTree()
})
</script>

<template>
  <main class="h-full bg-slate-50 text-slate-900  p-4">
    <div class="flex flex-1 ">
      <el-form ref="queryRef" :inline="true" :model="queryParams" @submit.prevent>
        <el-form-item style="margin-bottom: 0;">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入视频名称"
            clearable
            style="width: 240px"
            @keyup.enter="getList"
          />
        </el-form-item>

        <el-form-item style="margin-bottom: 0;">
          <el-tree-select
            v-model="queryParams.videoType"
            :data="videoTree"
            placeholder="请选择视频分类"
            :render-after-expand="false"
            :props="{
              label: 'name',
              value: 'id',
              children: 'children',
            }"
            style="width: 240px"
            @change="getList"
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
              <img :src="it.coverLink" class="absolute inset-0 w-full h-full object-cover">

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
              <span class="absolute right-2 bottom-2 rounded bg-black/70 text-white text-xs px-2">
                {{ fmtDuration(Number(it.videoLength)) }}
              </span>
            </div>

            <!-- 信息区 -->
            <div class="flex-1 p-2 flex flex-col justify-between">
              <div class="flex items-center" :title="it.name">
                <div class="text-sm font-semibold line-clamp-1">
                  {{ it.name }}
                </div>
                <el-tag type="info" size="small" class="ml-[4px]">
                  {{ it.videoTypeName }}
                </el-tag>
              </div>

              <el-tooltip
                v-model:visible="tooltipVisibleMap[it.id!]"
                :content="it.comment"
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
                简介：{{ it.comment || '-' }}
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

    <!-- 分页 -->
    <Pagination
      v-show="total > 0"
      v-model:page="queryParams.page.current"
      v-model:limit="queryParams.page.size"
      class="mt-[10px]"
      :total="total"
      @pagination="getList"
    />
    <!-- 预览弹窗 -->
    <transition name="zoom">
      <div v-if="previewVisible" class="fixed inset-0 z-40 grid place-items-center">
        <div class="absolute inset-0 bg-black/60" @click="previewVisible = false" />
        <div class="relative w-[94vw] max-w-4xl rounded-2xl bg-black p-3 shadow-xl">
          <video v-if="current?.address" autoplay :src="current.address" controls class="w-full rounded-lg" />
          <button class="absolute right-3 top-3 rounded-md bg-white/90 px-2 py-1 text-sm cursor-pointer" @click="previewVisible = false">
            关闭
          </button>
        </div>
      </div>
    </transition>
  </main>

  <VideoDialog v-model="visible" :is-add="isAdd" :data="currentData" :video-tree="videoTree" @success="getList" />
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
