<script setup lang="ts" generic="T extends number | undefined = undefined">
import type { UploadFile, UploadFiles, UploadInstance, UploadProgressEvent, UploadRawFile, UploadRequestOptions, UploadUserFile } from 'element-plus'

import type { EpPropMergeType } from 'element-plus/es/utils/index.mjs'
import type { UploadedFilesModel, UploadFileModel, UploadFileResponseModel } from './types'
import type { UploadRow } from '@/model/upload'
import { Plus } from '@element-plus/icons-vue'

import axios from 'axios'
import { dayjs, ElMessage, genFileId } from 'element-plus'
import { computed, defineExpose, defineModel, defineProps, nextTick, ref, watch } from 'vue'
/**
 * 上传组件 Props 定义
 */
const props = withDefaults(defineProps<{
  /** 上传接口地址（相对路径，若未指定 uploadUrl 则拼接此路径） */
  action?: string

  /**
   * - drag：拖拽上传模式
   * - avatar：头像上传模式 此时只允许传递一张
   * - list：列表上传模式
   * - button：按钮上传模式
   */
  mode?: UploadFileModel

  /** 完整上传地址（若存在则优先使用） */
  uploadUrl?: string

  /** 上传按钮图标尺寸（字符串，如 '16' 表示 16px） */
  iconSize?: string

  /** 上传按钮图标颜色（默认黑色） */
  iconColor?: string

  /** 预览容器宽度（字符串，自动补 px） */
  width?: string

  /** 预览容器高度（字符串，自动补 px） */
  height?: string

  /** 从服务端响应中解析文件 URL 的函数 */
  resolveUrl?: (resp: any) => string

  /** 是否只读（禁用上传交互） */
  readonly?: boolean

  /** 列表样式：'picture-card'、'text'、'picture' */
  listType?: EpPropMergeType<StringConstructor, 'picture-card' | 'text' | 'picture', unknown> | undefined

  /** HTTP 请求方法（POST、PUT、PATCH） */
  method?: 'POST' | 'PUT' | 'PATCH'

  /** 额外的请求头参数 */
  headers?: Record<string, string>

  /** 是否携带 cookie 信息 */
  withCredentials?: boolean

  /** 额外表单字段 */
  extraForm?: Record<string, any>

  /** 允许的文件类型，可为数组或字符串 */
  fileTypes?: string[] | string

  /** 限制文件最大体积（单位 MB） */
  maxSizeMB?: number

  /** 文件上传上限（limit=1 表示单文件模式） */
  limit?: T

  /** 是否在文件角上显示绿色角标 */
  isOccupyCorner?: boolean
}>(), {
  action: '/file/upload',
  mode: 'list',
  iconSize: '16',
  iconColor: '#000000',
  width: '100',
  height: '100',
  resolveUrl: (resp: any) =>
    resp?.data?.url
    ?? resp?.data?.public_url
    ?? resp?.data?.download_url
    ?? resp?.url
    ?? '',
  readonly: false,
  listType: 'picture-card',
  method: 'POST',
  headers: () => ({}),
  withCredentials: false,
  extraForm: () => ({}),
  fileTypes: () => [],
  maxSizeMB: 0,
  isOccupyCorner: false,
})
const emit = defineEmits<{
  (e: 'progress', row: UploadRow): void
  (e: 'success', row: UploadRow): void
  (e: 'error', row: UploadRow): void
  (e: 'onBeforeRemove', payload: { uploadFile: UploadFile, uploadFiles: UploadFiles }): void
  (e: 'onSuccess', payload: { response: ResponseData<any>, uploadFile: UploadFile, uploadFiles: UploadFiles }): void
  (e: 'onError', payload: { error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles }): void
  (e: 'onProgress', payload: { evt: UploadProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles }): void
  (e: 'onRemove', payload: { uploadFile: UploadFile, uploadFiles: UploadFiles }): void
}>()
// 类型守卫
function isSingleMode(limit: number | undefined): limit is 1 {
  return limit === 1
}

/**
 * 是否开启了拖拽
 */
const isFileDrag = computed(() => props.mode === 'drag')
/**
 * 是否为头像模式
 */
const isFileAvatar = computed(() => props.mode === 'avatar')
/**
 * 是否为列表模式
 */
const isFileList = computed(() => props.mode === 'list')
/**
 * 是否为按钮模式
 */
const isFileBtn = computed(() => props.mode === 'button')

const max = computed(() => props.mode === 'avatar' ? 1 : props.limit || 0)
const limit = computed(() => props.mode === 'avatar' ? 1 : props.limit || 0)
const itemMargin = computed(() => ((props.limit === 1 || props.mode === 'avatar') ? 0 : '10px'))

const width = computed(() => {
  if (props.mode === 'button') {
    return 'auto'
  }
  else {
    return props.width.includes('px') ? props.width : `${props.width}px`
  }
})
const height = computed(() => {
  if (props.mode === 'button') {
    return 'auto'
  }
  else {
    return props.height.includes('px') ? props.height : `${props.height}px`
  }
})
// const height = computed(() => (props.height.includes('px') ? props.height : `${props.height}px`))

const borderRadius = computed(() => (props.mode === 'avatar' ? '50%' : '6px'))
const progressSize = computed(() => (props.height.includes('px') ? `${Number.parseFloat(props.height) - 10}px` : `${Number(props.height) - 10}px`))
const oneLimitHeight = computed(() => (props.limit === 1 ? height.value : null))

const dialogImageUrl = ref('') // 预览缩略图
const dialogOriginalUrl = ref('') // 原文件URL
const dialogVisible = ref(false)

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
const VIDEO_EXTS = ['mp4', 'avi', 'mov', 'rmvb', 'wmv', 'flv', 'mkv', 'webm', 'm4v', '3gp']
const KNOWN_MIMES: Record<string, string[]> = { 'application/pdf': ['pdf'], 'application/zip': ['zip'], 'application/x-zip-compressed': ['zip'] }

const uploadRef = ref<UploadInstance | null>(null)
/**
 * 上传成功后的列表，当 limit 为1的时候为对象，其余时候为数组
 */
const fileData = defineModel<UploadUserFile[]>('fileData', {
  default: () => [], // ✅ 必须是数组
})

/**
 * 可实时更新上传进度的列表，当 limit 为1的时候为对象，其余时候为数组
 */
const uploadedFiles = defineModel<UploadedFilesModel<T>>('uploadedFiles', {
  default: () => null as any,
})

const inFlight = new Map<string, AbortController>()

/**
 * 是否限制为1
 */
const isSingle = computed(() => {
  return props.limit === 1
})

const finalUploadUrl = computed(() => {
  const base = import.meta.env.VITE_API_URL || ''
  const act = props.action || ''
  return props.uploadUrl ?? `${base}${act}`
})

function getRows(): UploadRow[] {
  const val = uploadedFiles.value
  if (Array.isArray(val)) {
    return [...val]
  }
  if (val && typeof val === 'object') {
    return [val]
  }
  return []
}

function setRows(rows: UploadRow[]): void {
  if (isSingleMode(props.limit)) {
    // 单文件：UploadRow | null
    uploadedFiles.value = (rows[0] ?? null) as unknown as UploadedFilesModel<T>
  }
  else {
    // 多文件：UploadRow[] | null
    uploadedFiles.value = rows as unknown as UploadedFilesModel<T>
  }
}

function ensureArrayMode(): void {
  const val = uploadedFiles.value
  if (isSingleMode(props.limit)) {
    if (Array.isArray(val)) {
      uploadedFiles.value = (val[0] ?? null) as unknown as UploadedFilesModel<T>
    }
  }
  else {
    if (!Array.isArray(val)) {
      uploadedFiles.value = (val ? [val] : []) as unknown as UploadedFilesModel<T>
    }
  }
}

watch(
  () => props.limit,
  () => {
    ensureArrayMode()
  },
  { immediate: true },
)

function formatBytes(bytes: number): string {
  const KB = 1024
  const MB = KB * 1024
  const GB = MB * 1024
  if (bytes < MB) {
    return `${(bytes / KB).toFixed(2)} KB`
  }
  if (bytes < GB) {
    return `${(bytes / MB).toFixed(2)} MB`
  }
  return `${(bytes / GB).toFixed(2)} GB`
}

interface NormalizedTypes {
  exts: Set<string>
  mimes: Set<string>
  acceptAttr: string
}

function normalizeFileTypes(input: string[] | string | undefined): NormalizedTypes {
  const tokens = Array.isArray(input) ? input : input ? [input] : []
  const exts = new Set<string>()
  const mimes = new Set<string>()
  if (tokens.length === 0) {
    return { exts, mimes, acceptAttr: '' }
  }
  tokens.forEach((raw) => {
    const t = String(raw).trim().toLowerCase()
    if (!t) {
      return
    }
    if (t === 'image' || t === 'image/*') {
      IMAGE_EXTS.forEach((e) => {
        exts.add(e)
      })
      mimes.add('image/*')
      return
    }
    if (t === 'video' || t === 'video/*') {
      VIDEO_EXTS.forEach((e) => {
        exts.add(e)
      })
      mimes.add('video/*')
      return
    }
    if (t === 'pdf') {
      exts.add('pdf')
      mimes.add('application/pdf')
      return
    }
    if (t === 'zip') {
      exts.add('zip')
      mimes.add('application/zip')
      return
    }
    if (t.startsWith('application/')) {
      const mapped = KNOWN_MIMES[t] || []
      mapped.forEach((e) => {
        exts.add(e)
      })
      mimes.add(t)
      return
    }
    const pure = t.startsWith('.') ? t.slice(1) : t
    if (/^[a-z0-9]+$/.test(pure)) {
      exts.add(pure)
    }
  })
  const acceptParts: string[] = []
  mimes.forEach((m) => {
    acceptParts.push(m)
  })
  exts.forEach((e) => {
    acceptParts.push(`.${e}`)
  })
  return { exts, mimes, acceptAttr: acceptParts.join(',') }
}

const normalizedTypes = computed(() => {
  return normalizeFileTypes(props.fileTypes)
})

function matchByType(file: UploadRawFile, norm: NormalizedTypes): boolean {
  if (norm.exts.size === 0 && norm.mimes.size === 0) {
    return true
  }
  const mime = (file.type || '').toLowerCase()
  const name = file.name || ''
  const ext = name.includes('.') ? name.split('.').pop()!.toLowerCase() : ''
  if (ext && norm.exts.has(ext)) {
    return true
  }
  const okMime = mime && (norm.mimes.has(mime) || [...norm.mimes].some((m) => {
    if (!m.endsWith('/*')) {
      return false
    }
    const prefix = `${m.split('/')[0]}/`
    return mime.startsWith(prefix)
  }))
  if (okMime) {
    return true
  }
  return false
}

function checkSize(file: UploadRawFile, maxMB: number): true | string {
  if (!maxMB || maxMB <= 0) {
    return true
  }
  const ok = file.size <= maxMB * 1024 * 1024
  if (ok) {
    return true
  }
  return `文件过大，最大支持 ${maxMB} MB，当前 ${formatBytes(file.size)}`
}
/** 在新标签页内联预览原文件（Blob 方式） */
async function openOriginal() {
  const fileUrl = dialogOriginalUrl.value
  if (!fileUrl)
    return
  try {
    const res = await fetch(fileUrl, { credentials: 'omit' })
    if (!res.ok)
      throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    window.open(blobUrl, '_blank')
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000)
  }
  catch (e) {
    console.error(e)
    ElMessage.error('预览失败')
  }
}

/** 预览：图片/封面/图标，并提供“在新窗口打开原文件” */
async function handlePictureCardPreview(uploadFile: UploadFile) {
  const f = uploadFile
  dialogImageUrl.value = f.url || ''
  dialogOriginalUrl.value = (f.url || uploadFile.url || '') as string
  dialogVisible.value = true
}

function handleRemove(uploadFile: UploadFile, uploadFiles: UploadFiles) {
  // if (Array.isArray(fileLists.value)) {
  //   const idx = fileLists.value.findIndex(it => it === uploadFile.url || (uploadFile as any).originUrl === it)
  //   if (idx !== -1)
  //     fileLists.value.splice(idx, 1)
  // }
  // else {
  //   fileLists.value = ''
  // }
  emit('onRemove', { uploadFile, uploadFiles })
  // updateExtBadges()
}

/* ===================== Hooks ===================== */
/**
 * 上传之前
 */
function beforeUpload(file: UploadRawFile) {
  const okType = matchByType(file, normalizedTypes.value)
  if (!okType) {
    const hint = normalizedTypes.value.acceptAttr || '所需类型'
    ElMessage.error(`文件类型不符合要求，仅支持：${hint}`)
    if (isSingleMode(props.limit)) {
      uploadedFiles.value = null as UploadedFilesModel<T>
    }
    else {
      uploadedFiles.value = [] as unknown as UploadedFilesModel<T>
    }
    return false
  }
  const sizeCheck = checkSize(file, props.maxSizeMB)
  if (sizeCheck !== true) {
    ElMessage.error(sizeCheck)
    return false
  }
  return true
}

/** 允许外部拦截删除 */
function beforeRemove(_uploadFile: UploadFile, _uploadFiles: UploadFiles): Awaitable<boolean> {
  emit('onBeforeRemove', { uploadFile: _uploadFile, uploadFiles: _uploadFiles })
  return true
}

/** 成功回调（非 200 也视为失败处理） */
async function handleSuccess(response: ResponseData<UploadFileResponseModel>, uploadFile: UploadFile, uploadFiles: UploadFiles) {
  if (!response) {
    // 判空，主要是element-plus内部还会自动触发一次
    // 目前我已经在doUpload中主动触发了
    return
  }
  if (response && response.code === 0 && response.data) {
    const publicUrl = response.data.accessPath
    uploadFile.url = publicUrl

    // 同步 v-model
    // ✅ 同步到 fileData（Element Plus 预览列表）
    if (Array.isArray(fileData.value)) {
      const target = fileData.value.find(f => f.uid === uploadFile.uid)
      if (target) {
        target.url = `${publicUrl}`
        target.status = 'success'
      }
      else {
        fileData.value.push({
          name: uploadFile.name,
          url: `_URL__}${publicUrl}`,
          status: 'success',
          uid: uploadFile.uid,
        })
      }
    }

    emit('onSuccess', { response, uploadFile, uploadFiles })
  }
  else {
    ElMessage.error(response?.msg || '上传失败')
  }
}

/** 失败回调：❗移除该文件，避免失败预览残留（你提的第 1 点） */
function handleError(_error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) {
  ElMessage.error(_error?.message || '上传失败')
  emit('onError', { error: _error, uploadFile, uploadFiles })
}

function handleProgress(_evt: UploadProgressEvent, _uploadFile: UploadFile, _uploadFiles: UploadFiles) {
  // console.log(_evt, '进度')

  emit('onProgress', { evt: _evt, uploadFile: _uploadFile, uploadFiles: _uploadFiles })
}

function onExceed(filesRaw: File[]) {
  const raw = filesRaw[0] as UploadRawFile
  uploadRef.value?.clearFiles()
  setRows([])
  raw.uid = genFileId()
  uploadRef.value?.handleStart(raw)
  uploadRef.value?.submit()
}

function upsert(uid: string, patch: Partial<UploadRow> & Pick<UploadRow, 'uid'>) {
  const rows = getRows()
  if (isSingle.value) {
    const old = rows[0] || null
    const merged = { ...(old || {}), ...patch } as UploadRow
    setRows([merged])
    return
  }
  const idx = rows.findIndex((r) => {
    return r.uid === uid
  })
  if (idx === -1) {
    rows.push(patch as UploadRow)
    setRows(rows)
    return
  }
  rows[idx] = { ...rows[idx], ...patch }
  setRows(rows)
}

function getRow(uid: string): UploadRow {
  const rows = getRows()
  const found = rows.find((r) => {
    return r.uid === uid
  })
  return found as UploadRow
}

function currentForUid(uid: string): UploadRow {
  const val = uploadedFiles.value
  if (isSingle.value) {
    return val as UploadRow
  }
  return getRow(uid)
}

function handleChange(uploadFile: UploadUserFile) {
  const uid = String((uploadFile as any).uid)
  const rows = getRows()
  const exists = rows.some((r) => {
    return r.uid === uid
  })
  if (exists) {
    return
  }
  if (isSingle.value) {
    setRows([])
  }
  const f = uploadFile.raw as File
  const sizeBytes = f?.size ?? 0
  upsert(uid, {
    uid,
    name: uploadFile.name || f?.name || '',
    type: f?.type || '',
    size: formatBytes(sizeBytes),
    sizeBytes,
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    progress: 0,
    url: '',
    status: 'uploading',
  })
  emit('progress', currentForUid(uid))
}

function makeUploadProgressEvent(percent: number, loaded = 0, total = 100): UploadProgressEvent {
  const evt = new ProgressEvent('progress', { lengthComputable: true, loaded, total })
  ;(evt as any).percent = percent
  return evt as UploadProgressEvent
}

async function doUpload({ file, onProgress, onSuccess, onError }: UploadRequestOptions) {
  const f = file as File
  const uidStr = String((file as any).uid)
  const rows = getRows()
  const exists = rows.some((r) => {
    return r.uid === uidStr
  })
  if (!exists) {
    if (isSingle.value) {
      setRows([])
    }
    const sizeBytes = f.size
    upsert(uidStr, {
      uid: uidStr,
      name: f.name,
      type: f.type || '',
      size: formatBytes(sizeBytes),
      sizeBytes,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      progress: 0,
      url: '',
      status: 'uploading',
    })
  }
  const controller = new AbortController()
  inFlight.set(uidStr, controller)
  try {
    const form = new FormData()
    form.append('file', f)
    Object.entries(props.extraForm).forEach(([k, v]) => {
      form.append(k, String(v))
    })
    let last = 0
    const res = await axios.request({
      method: props.method,
      url: finalUploadUrl.value,
      data: form,
      headers: { 'Content-Type': 'multipart/form-data', ...props.headers },
      withCredentials: props.withCredentials,
      signal: controller.signal,
      onUploadProgress: (e) => {
        if (!e.total) {
          return
        }
        let p = Math.floor((e.loaded / e.total) * 100)
        if (p >= 100) {
          p = 99
        }
        if (p > last) {
          last = p
          upsert(uidStr, { uid: uidStr, progress: p, status: 'uploading' })
          onProgress?.(makeUploadProgressEvent(p, e.loaded, e.total))
          emit('progress', currentForUid(uidStr))
        }
      },
    })
    console.log(res, 'res')

    const data = res.data
    if (data?.code && data.code !== 0) {
      throw new Error(data?.msg || '上传失败')
    }
    const url = props.resolveUrl(data)
    upsert(uidStr, { uid: uidStr, progress: 100, status: 'success', url, response: data })
    onSuccess?.(data)
    onProgress?.(makeUploadProgressEvent(100, 1, 1))
    await nextTick()
    emit('success', currentForUid(uidStr))
  }
  catch (err: any) {
    const canceled = err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError' || err?.message === 'canceled'
    if (canceled) {
      upsert(uidStr, { uid: uidStr, status: 'fail', message: '已取消' })
      onError?.(err)
    }
    else {
      upsert(uidStr, { uid: uidStr, status: 'fail', message: err?.message || '上传失败' })
      onError?.(err)
      emit('error', currentForUid(uidStr))
      ElMessage.error(err?.message || '上传失败')
    }
  }
  finally {
    inFlight.delete(uidStr)
  }
}

function abortUpload(target: UploadFile | UploadRow | string | number) {
  const uidStr = typeof target === 'object' ? String((target as any).uid) : String(target)
  const controller = inFlight.get(uidStr)
  if (controller) {
    controller.abort()
  }
  const elFile = { name: '', status: 'ready', uid: Number(uidStr) } as UploadFile
  uploadRef.value?.abort(elFile)
  upsert(uidStr, { uid: uidStr, status: 'fail', message: '已取消' })
}

defineExpose({
  abortUpload,
})
</script>

<template>
  <div
    class="upload-wrap" :class="{ 'has-corner': isOccupyCorner }"
  >
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileData"
      :class="{ 'avatar-mode': mode === 'avatar', 'readonly': readonly || (max > 0 && Array.isArray(fileData) ? fileData.length >= max : false) }"
      :drag="isFileDrag"
      action=""
      :list-type="mode !== 'button' ? (mode === 'avatar' ? 'picture-card' : listType) : undefined"
      multiple
      :show-file-list="mode !== 'button'"
      :limit="limit"
      :accept="normalizedTypes.acceptAttr"
      :http-request="doUpload"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-progress=" handleProgress "
      :on-preview="mode !== 'button' ? handlePictureCardPreview : undefined"
      :on-remove="handleRemove"
      :on-exceed="onExceed"
    >
      <div v-if="isFileDrag" class="h-full flex flex-col justify-center items-center text-[#1b79ff]">
        <svg
          viewBox="0 0 1024 1024"
          focusable="false"
          data-icon="inbox"
          width="1.5em"
          height="1.5em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0060.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"
          />
        </svg>
        <div class="text-[#000000] text-xs mt-[4px]">
          单击或拖动文件到此区域进行上传
        </div>
        <div v-if="limit || 0 > 1" class="mt-[4px] text-[12px] text-gray-400">
          <!-- 支持批量上传 -->
        </div>
      </div>

      <div
        v-if="isFileList || isFileAvatar"
        class="flex-center flex-col text-center"
        :class="{ 'avatar-upload': isFileAvatar }"
      >
        <el-icon :size="iconSize" :color="iconColor">
          <Plus />
        </el-icon>
      </div>

      <slot name="button">
        <el-button v-if="isFileBtn" type="primary">
          选择文件
        </el-button>
      </slot>
    </el-upload>

    <el-dialog v-model="dialogVisible" append-to-body width="520px">
      <div class="mb-3 flex items-center justify-between">
        <div class="text-xs text-gray-500 truncate" :title="dialogOriginalUrl">
          {{ dialogOriginalUrl }}
        </div>
        <el-button v-if="dialogOriginalUrl" type="primary" text @click="openOriginal">
          在新窗口打开
        </el-button>
      </div>
      <img :src="dialogImageUrl" alt="预览">
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.upload-wrap {
  position: relative;
}

img {
  width: 100%;
  height: auto;
}
.readonly {
  height: v-bind(oneLimitHeight) !important;
  // 动态控制是否上传到限制之后就显示或隐藏上传框
  :deep(.el-upload-list__item-status-label),
  :deep(.el-upload--picture-card) {
    display: none !important;
  }
}
:deep(.el-upload-list__item-actions) {
  width: v-bind(width) !important;
  height: v-bind(height) !important;
}
:deep(.el-upload--picture-card) {
  width: v-bind(width) !important;
  height: v-bind(height) !important;
  margin-bottom: v-bind(itemMargin) !important;
  margin-right: v-bind(itemMargin) !important;
  border-radius: v-bind(borderRadius) !important;
}
:deep(.is-uploading) {
  width: v-bind(width) !important;
  height: v-bind(height) !important;
  border-radius: v-bind(borderRadius) !important;
}

:deep(.el-upload-list__item) {
  width: v-bind(width) !important;
  height: v-bind(height) !important;
  margin-bottom: v-bind(itemMargin) !important;
  margin-right: v-bind(itemMargin) !important;
  border-radius: v-bind(borderRadius) !important;
}

:deep(.is-success) {
  width: v-bind(width) !important;
  height: v-bind(height) !important;
  margin: 0;
  border-radius: v-bind(borderRadius) !important;
}
:deep(.el-icon--close-tip) {
  display: none !important;
}

// 用于合理的显示进度条
:deep(.el-progress-circle) {
  width: v-bind(progressSize) !important;
  height: v-bind(progressSize) !important;
  border-radius: v-bind(borderRadius) !important;
}
:deep(.el-progress) {
  width: v-bind(progressSize) !important;
  height: v-bind(progressSize) !important;
  border-radius: v-bind(borderRadius) !important;
}

:deep(.el-upload-dragger) {
  width: v-bind(width) !important;
  height: v-bind(height) !important;
  border-radius: v-bind(borderRadius) !important;
}

.avatar-upload {
  overflow: hidden;
  /* 保证是正方形容器 */
  width: v-bind(width) !important;
  height: v-bind(width) !important;
  border-radius: v-bind(borderRadius) !important;
}

/* ✅ 角标：仅在 has-corner 时启用 */
.has-corner :deep(.el-upload-list__item)::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  border-top: 36px solid #34c759;
  border-left: 36px solid transparent;
  border-top-right-radius: 6px;
}
.has-corner :deep(.el-upload-list__item)::before {
  content: attr(data-ext);
  position: absolute;
  top: 10px;
  right: 1px;
  width: 20px;
  transform: rotate(45deg);
  transform-origin: top right;
  text-align: right;
  color: #fff;
  font-size: 10px;
  z-index: 2;
}

/* 文件名展示（可开） */
.filename-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px 10px;
  margin-top: 6px;
}
.filename-grid .name {
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.avatar-mode {
  background-color: unset !important;
}
</style>
