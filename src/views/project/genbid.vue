<script setup lang="ts">
import type { CategoryModel } from '@/model/category'
import type { GenbidModel } from '@/model/genbid'
import { getCategoryTree } from '@/api/category'
import { getGenbidList } from '@/api/genbid'
import { download } from '@/utils/request/download'

const route = useRoute()
const loading = ref(false)
const queryParams = ref<ListPageParamsWrapper<GenbidModel>>({
  page: {
    size: 1000,
    current: 1,
  },
})
const currentProjectId = computed(() => route.params.timesBidId as string)

const categoryList = ref<CategoryModel[]>([])
function getCategoryListData() {
  getCategoryTree({}).then((res) => {
    categoryList.value = res.data
  })
}

/** 静态日志数据（示例） */
const list = ref<GenbidModel[]>([])

function getList(): void {
  if (loading.value)
    return
  loading.value = true
  const data = {
    ...queryParams.value,
    timesBidId: currentProjectId.value,
  }
  getGenbidList(data).then((res) => {
    list.value = res.data.records
  }).finally(() => {
    loading.value = false
  })
}

function handleBatchDownload(row: GenbidModel) {
  download.get({
    url: `/upload/${row.fileLink}`,
    filename: extractDocFilename(row.fileLink || ''),
  })
  const url = `${window.webConfig.webApiBaseUrl || __API_URL__}/api/project/downloadZip`
  console.log(url)
}

/**
 * 从路径中提取 .doc / .docx 文件名（忽略大小写）
 * 例：d:/file/xxx/施工方案.docx?download=1 -> 施工方案.docx
 */
function extractDocFilename(path: string): string {
  if (!path)
    return ''
  const withoutHash = String(path).split('#')[0]
  const withoutQuery = withoutHash.split('?')[0]
  const match = withoutQuery.match(/[^/\\]+\.docx?$/i)
  return match ? match[0] : ''
}

onMounted(() => {
  getList()
  getCategoryListData()
})
</script>

<template>
  <div class="app-container">
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="list"
      row-key="id"
      style="width: 100%"
    >
      <el-table-column prop="id" label="编号" align="center" />

      <el-table-column prop="fileLink" label="文件链接" align="center" show-overflow-tooltip />

      <el-table-column label="创建人" align="center" prop="createdUserName" width="120" show-overflow-tooltip>
        <template #default="{ row }">
          <span>{{ row.createdUserName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" prop="createdTime" width="220">
        <template #default="{ row }">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template #default="{ row }">
          <el-button type="warning" size="small" @click="handleBatchDownload(row)">
            下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">

</style>
