<script setup lang="ts">
import type { AddPredictResponse, AddPredictResponseData } from '@/model/predict'
import { Histogram, Refresh, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { formatPrice } from '@/utils'
import Chart from './chart.vue'

const route = useRoute()
const loading = ref(false)
const chartVisible = ref(false)
const key = String(route.query.key ?? '')
const predictResponse = ref<AddPredictResponse<AddPredictResponseData>>({
  resultData: [],
  x: [],
  y: [],
})
const names = ref<string[]>([])
const single = ref(true)
const multiple = ref(true)
const queryRef = useTemplateRef('queryEl')
const queryParams = ref<ListPageParamsWrapper<AddPredictResponseData>>({
  page: {
    size: 10,
    current: 1,
  },
})

const clientPage = computed(() => {
  const k = String(queryParams.value.bqName || '').trim().toLowerCase()
  const list = predictResponse.value.resultData
  console.log(list, 'list')

  const filtered = k ? list.filter(r => String(r?.bqName || '').toLowerCase().includes(k)) : list
  const start = (queryParams.value.page.current - 1) * queryParams.value.page.size
  const end = start + queryParams.value.page.size
  return { rows: filtered.slice(start, end), total: filtered.length }
})

const chartData = computed(() => {
  return {
    x: predictResponse.value.x,
    y: predictResponse.value.y,
    data: predictResponse.value.resultData.map(it => it.resultData || ''),
  }
})

function safeParse(s: string | null) {
  if (!s)
    return null
  try {
    return JSON.parse(s)
  }
  catch { return null }
}

function handleSelectionChange(selection: AddPredictResponseData[]) {
  names.value = selection.map(item => item.bqName!)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

function removeKey() {
  console.log('触发removeKey')

  if (key)
    localStorage.removeItem(key)
}

function retQuery(): void {
  queryParams.value = {
    page: {
      current: 1,
      size: 10,
    },
  }
  resetForm(queryRef.value)
}
function handleChart() {
  chartVisible.value = true
}

onMounted(() => {
  if (!key) {
    ElMessage.error('缺少数据 key')
    return
  }

  // 1) 优先用 sessionStorage（刷新后也能读到）
  let raw = sessionStorage.getItem(key)

  // 2) session 没有则尝试 local，并迁移到 session（同时删除 local）
  if (raw == null) {
    raw = localStorage.getItem(key)
    if (raw != null) {
      sessionStorage.setItem(key, raw)
      localStorage.removeItem(key)
    }
  }

  if (raw == null) {
    ElMessage.error('数据不存在或已被清理')
    return
  }

  // 3) 只解析一次
  const obj = safeParse(raw) as AddPredictResponse<AddPredictResponseData>
  if (obj == null) {
    ElMessage.error('数据格式错误')
    return
  }

  predictResponse.value = obj
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
  <div class="app-container">
    <!-- 查询 -->
    <el-form ref="queryEl" :inline="true" :model="queryParams" @submit.prevent>
      <el-form-item>
        <el-input
          v-model="queryParams.bqName"
          placeholder="请输入名称查询"
          clearable
          style="width: 200px"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search">
          查询
        </el-button>
        <el-button type="primary" plain :icon="Refresh" @click="retQuery">
          查询重置
        </el-button>

        <el-button type="success" plain :icon="Histogram" @click="handleChart">
          图标展示
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="clientPage.rows"
      row-key="id"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="originalName" label="项目" align="center" show-overflow-tooltip />

      <el-table-column prop="bqName" label="名称" align="center" show-overflow-tooltip />

      <el-table-column label="价格" align="center" width="100">
        <template #default="{ row }">
          {{ formatPrice(row.otherPrice, { unit: '¥' }) }}
        </template>
      </el-table-column>

      <el-table-column prop="resultData" label="结果" align="center" />
    </el-table>

    <Pagination
      v-show="clientPage.total > 0"
      v-model:page-num="queryParams.page.current"
      v-model:page-size="queryParams.page.size"
      :total="clientPage.total"
      @pagination="() => {}"
    />

    <Chart v-model:visible="chartVisible" :chart-data="chartData" />
  </div>
</template>
