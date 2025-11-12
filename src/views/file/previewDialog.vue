<script setup lang="ts">
import type { PropType } from 'vue'
import VueOfficeDocx from '@vue-office/docx'
import { saveAs } from 'file-saver'
import '@vue-office/docx/lib/index.css'
// props
const props = defineProps({
  type: {
    type: String as PropType<'word' | 'content'>,
    required: true,
  },
  docUrl: {
    type: String,
    default: '',
  },
  contentText: {
    type: String,
    default: '',
  },
})
const sss = ref('')
watch(() => props.contentText, (val) => {
  sss.value = val
}, {
  immediate: true,
})
// v-model
const visible = defineModel<boolean>('visible', {
  type: Boolean,
  required: true,
})

// 关闭
function cancel() {
  visible.value = false
}

// 渲染回调
function renderedHandler() {
  console.log('渲染完成')
}
function errorHandler() {
  console.log('渲染失败')
}

// 下载 Word
async function handleDownload() {
  if (props.type === 'word') {
    // 直接下载 URL 文件
    try {
      const res = await fetch(props.docUrl)
      const blob = await res.blob()
      saveAs(blob, getFilenameFromUrl(props.docUrl))
    }
    catch (e) {
      console.error('文件下载失败', e)
    }
    return
  }

  // content 模式 → 转成 Word 下载
  const content = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:w="urn:schemas-microsoft-com:office:word"
    xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"></head>
    <body>${props.contentText}</body></html>`

  const blob = new Blob(['\uFEFF', content], { type: 'application/msword' })
  saveAs(blob, '内容预览.doc')
}

// 从 URL 提取文件名
function getFilenameFromUrl(url: string) {
  try {
    return url.split('/').pop() || '下载文件.docx'
  }
  catch {
    return '下载文件.docx'
  }
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="文件预览"
    width="900px"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <!-- 下载按钮 -->
    <template #header>
      <div class="dialog-header">
        <span>文件预览</span>
        <el-button type="primary" size="small" @click="handleDownload">
          下载
        </el-button>
      </div>
    </template>

    <div class="card">
      <!-- 预览 Word -->
      <VueOfficeDocx
        v-if="type === 'word'"
        :src="docUrl"
        style="height: calc(100vh - 200px);"
        @rendered="renderedHandler"
        @error="errorHandler"
      />

      <div v-else>
        {{ sss }}
      </div>
      <!-- <Editor
        v-else
        v-model="sss"
        :default-config="editorConfig"
        mode="default"
        style="height: 400px"
      /> -->
    </div>
  </el-dialog>
</template>

<style scoped lang="scss">
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  padding-right: 10px;
}

.rich-preview table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.rich-preview th,
.rich-preview td {
  border: 1px solid #ddd;
  padding: 6px 10px;
  text-align: left;
  min-height: 30px;
}

.rich-preview th {
  background: #f8f9fa;
  font-weight: bold;
}

.rich-preview tr {
  height: 30px;
}

.rich-preview col {
  width: 60px;
}
</style>
