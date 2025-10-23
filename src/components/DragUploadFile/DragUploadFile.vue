<script setup lang="ts">
import type { UploadFile, UploadInstance, UploadProgressEvent, UploadRawFile, UploadRequestOptions, UploadUserFile } from 'element-plus'

import type { PropType } from 'vue'
import type { UploadRow } from '@/model/upload'
import axios from 'axios'
import { dayjs, ElMessage, genFileId } from 'element-plus'

import { computed, defineExpose, defineModel, defineProps, nextTick, ref, watch } from 'vue'

const props = defineProps({
  action: { type: String, default: '/file/upload' },
  uploadUrl: { type: String },
  resolveUrl: {
    type: Function as PropType<(resp: any) => string>,
    default: (resp: any) => {
      return resp?.data?.url ?? resp?.data?.public_url ?? resp?.data?.download_url ?? resp?.url ?? ''
    },
  },
  method: { type: String as PropType<'POST' | 'PUT' | 'PATCH'>, default: 'POST' },
  headers: { type: Object as PropType<Record<string, string>>, default: () => ({}) },
  withCredentials: { type: Boolean, default: false },
  extraForm: { type: Object as PropType<Record<string, any>>, default: () => ({}) },
  fileTypes: { type: [Array, String] as PropType<string[] | string>, default: () => [] as string[] },
  maxSizeMB: { type: Number, default: 0 },
  limit: { type: Number, default: 0 },
})

const emit = defineEmits<{
  (e: 'progress', row: UploadRow): void
  (e: 'success', row: UploadRow): void
  (e: 'error', row: UploadRow): void
}>()

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
const VIDEO_EXTS = ['mp4', 'avi', 'mov', 'rmvb', 'wmv', 'flv', 'mkv', 'webm', 'm4v', '3gp']
const KNOWN_MIMES: Record<string, string[]> = { 'application/pdf': ['pdf'], 'application/zip': ['zip'], 'application/x-zip-compressed': ['zip'] }

const uploadRef = ref<UploadInstance | null>(null)
const files = defineModel<UploadRow[] | UploadRow | null>('files', { default: () => null })
const inFlight = new Map<string, AbortController>()

const isSingle = computed(() => {
  return props.limit === 1
})

const finalUploadUrl = computed(() => {
  const base = import.meta.env.VITE_API_URL || ''
  const act = props.action || ''
  return props.uploadUrl ?? `${base}${act}`
})

function getRows(): UploadRow[] {
  const val = files.value
  if (Array.isArray(val)) {
    return [...val]
  }
  if (val && typeof val === 'object') {
    return [val]
  }
  return []
}

function setRows(rows: UploadRow[]): void {
  if (isSingle.value) {
    const first = rows[0] || null
    files.value = first
    return
  }
  files.value = rows
}

function ensureArrayMode(): void {
  const val = files.value
  if (isSingle.value) {
    if (Array.isArray(val)) {
      const first = val[0] || null
      files.value = first
    }
    return
  }
  if (!Array.isArray(val)) {
    if (val) {
      files.value = [val]
      return
    }
    files.value = []
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

function beforeUpload(file: UploadRawFile) {
  const okType = matchByType(file, normalizedTypes.value)
  if (!okType) {
    const hint = normalizedTypes.value.acceptAttr || '所需类型'
    ElMessage.error(`文件类型不符合要求，仅支持：${hint}`)
    files.value = isSingle.value ? null : []
    return false
  }
  const sizeCheck = checkSize(file, props.maxSizeMB)
  if (sizeCheck !== true) {
    ElMessage.error(sizeCheck)
    return false
  }
  return true
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
  const val = files.value
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
    clearAfterEnd()
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

function clearAfterEnd() {
  if (isSingle.value) {
    uploadRef.value?.clearFiles()
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
  <el-upload
    ref="uploadRef"
    class="upload-demo h-full"
    drag
    action=""
    :show-file-list="false"
    :http-request="doUpload"
    :on-change="handleChange"
    :before-upload="beforeUpload"
    :on-exceed="onExceed"
    multiple
    :limit="limit > 0 ? limit : undefined"
    :accept="normalizedTypes.acceptAttr"
    style="background-color:#fafafa;height: 100%;"
  >
    <div class="h-full flex flex-col justify-center items-center text-[#1b79ff]">
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
      <div v-if="limit > 1" class="mt-[4px] text-[12px] text-gray-400">
        支持批量上传
      </div>
    </div>
  </el-upload>
</template>

<style lang="scss" scoped>
:deep(.el-upload) {
  width: 100% !important;
  height: 100% !important;
}
:deep(.el-upload-dragger) {
  height: 100% !important;
  width: 100% !important;
}
</style>
