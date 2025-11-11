<script setup lang="ts">
import type {
  UploadFile,
  UploadFiles,
  UploadProps,
  UploadRequestHandler,
} from 'element-plus'
import { ElMessage } from 'element-plus'

const props = withDefaults(
  defineProps<{
    btnText?: string
    handleUpload: UploadRequestHandler
    accept?: string | string[]
    maxSizeMB?: number
  }>(),
  {
    btnText: '选择文件',
    accept: '.xlsx, .xls',
    maxSizeMB: 100,
  },
)

const emit = defineEmits<{
  (e: 'onError'): void
  (e: 'onSuccess', p: { file: UploadFile, _fileList: UploadFiles, response: any }): void
}>()

function handleExceed() {
  console.log('handleExceed')
}

function handleError() {
  emit('onError')
}

/** 关键：type 为空就完全走“后缀白名单”，并支持 .yfjz / .yfjt */
const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
  console.log(file, 'file')
  const fileName = getFileExt(file.name)
  const ok = matchAccept(fileName, props.accept)
  if (!ok) {
    ElMessage.error(`仅支持导入：${formatAcceptTips(props.accept)}`)
    return false
  }
}

function handleSuccess(response: any, file: UploadFile, _fileList: UploadFiles) {
  emit('onSuccess', { file, _fileList, response })
}

/**
 * 校验 fileName 是否命中 accept（string | string[]）
 * - 字符串支持逗号分隔
 * - 类型不对会提示并返回 false
 */
function matchAccept(fileName: string, accept: unknown): boolean {
  if (typeof fileName !== 'string') {
    ElMessage.error('参数错误：fileName 必须是字符串')
    return false
  }
  if (Array.isArray(accept)) {
    const ok = inArrayIgnoreCase(fileName, accept)
    return ok
  }
  if (typeof accept === 'string') {
    const hasComma = accept.includes(',')
    const ok = hasComma ? inArrayIgnoreCase(fileName, accept) : equalsIgnoreCase(fileName, accept)
    return ok
  }
  ElMessage.error('参数错误：accept 必须是 string 或 string[]')
  return false
}

function formatAcceptTips(accept: string | string[]): string {
  const { exts, mimes, wild } = parseAccept(accept)
  const parts: string[] = []
  if (exts.size)
    parts.push([...exts].join('、'))
  if (mimes.size)
    parts.push([...mimes].join('、'))
  if (wild.size)
    parts.push([...wild].map(w => `${w}/*`).join('、'))
  return parts.length ? parts.join('，') : '任意类型'
}

function parseAccept(input: string | string[]) {
  const list = Array.isArray(input) ? input : String(input).split(',')
  const tokens = list.map(s => String(s).trim().toLowerCase()).filter(Boolean)
  const exts = new Set<string>()
  const mimes = new Set<string>()
  const wild = new Set<string>()
  for (const t of tokens) {
    if (!t)
      continue
    if (t.startsWith('.')) {
      exts.add(t)
      continue
    }
    if (t.includes('/')) {
      t.endsWith('/*') ? wild.add(t.split('/')[0]) : mimes.add(t)
      continue
    }
    exts.add(`.${t.replace(/^\./, '')}`) // 把别名当作自定义后缀显示，例如 yfjz -> .yfjz
  }
  return { exts, mimes, wild }
}

/**
 * 获取文件后缀名
 * - 默认返回写，如 "yfjt"
 * @param name 文件名
 * @param {object} [options] 可选项
 * @param options.lowercase 是否转小写，默认 true
 * @param options.includeDot 是否保留开头的点，默认 false
 * @returns 后缀字符串；未找到返回空串 ""
 */
function getFileExt(
  name: string,
  options: { lowercase?: boolean, includeDot?: boolean } = {},
): string {
  const lower = options.lowercase ?? true
  const keepDot = options.includeDot ?? false
  if (!name)
    return ''
  let n = String(name)
  n = n.replace(/\uFF0E/g, '.')
  n = n.replace(/^[‘’“”'"]+|[‘’“”'"]+$/g, '')
  n = n.trim()
  const idx = n.lastIndexOf('.')
  if (idx < 0)
    return ''
  let ext = n.slice(idx)
  if (!keepDot)
    ext = ext.slice(1)
  if (lower)
    ext = ext.toLowerCase()
  return ext
}

function equalsIgnoreCase(a: string, b: string): boolean {
  if (a == null || b == null)
    return false
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}
/**
 * 判断 needle 是否在 candidates 中（大小写不敏感）
 * candidates 可为 string[] 或逗号分隔字符串
 * @param {string} needle 目标值，如 'yfjz'
 * @param {string[] | string} candidates 候选列表，如 ['YFJZ','YFJT'] 或 'YFJZ,YFJT'
 * @returns {boolean} 命中返回 true
 */
function inArrayIgnoreCase(needle: string, candidates: string[] | string): boolean {
  if (!needle || candidates == null)
    return false
  const list = Array.isArray(candidates) ? candidates : String(candidates).split(',')
  for (const item of list) {
    if (equalsIgnoreCase(needle, item))
      return true
  }
  return false
}
</script>

<template>
  <el-upload
    :http-request="handleUpload"
    :on-exceed="handleExceed"
    :on-error="handleError"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"

    :show-file-list="false"
  >
    <slot>
      <el-button type="primary">
        {{ btnText }}
      </el-button>
    </slot>
  </el-upload>
</template>
