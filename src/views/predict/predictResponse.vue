<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const key = String(route.query.key ?? '')
const data = ref<any>(null)

function safeParse(s: string | null) {
  if (!s)
    return null
  try {
    return JSON.parse(s)
  }
  catch { return null }
}

function removeKey() {
  console.log('触发removeKey')

  if (key)
    localStorage.removeItem(key)
}

onMounted(() => {
  if (!key) {
    ElMessage.error('缺少数据 key')
    return
  }
  const raw = localStorage.getItem(key)
  console.log(key, 'key')
  console.log(raw, 'raw')

  const obj = safeParse(raw)
  if (!obj) {
    ElMessage.error('数据不存在或已被清理')
    return
  }
  data.value = obj
})

// ✅ 兜底：标签页关闭、刷新、前进后退离开时再删一次（幂等）
function onPageHide() {
  removeKey()
}
window.addEventListener('pagehide', onPageHide)
onBeforeUnmount(() => {
  window.removeEventListener('pagehide', onPageHide)
})
</script>

<template>
  <div class="page">
    <h1>预测结果</h1>
    <pre class="json">{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>
