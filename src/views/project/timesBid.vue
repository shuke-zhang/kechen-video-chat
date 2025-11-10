<script setup lang="ts">
import type { CategoryModel } from '@/model/category'
import type { TimesBidModel } from '@/model/timesBid'
import { getCategoryTree } from '@/api/category'
import { getTimesBidList } from '@/api/timesBid'
import { download } from '@/utils/request/download'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const queryParams = ref<ListPageParamsWrapper<TimesBidModel>>({
  page: {
    size: 10000,
    current: 1,
  },
})
const currentProjectId = computed(() => route.params.id as string)

const categoryList = ref<CategoryModel[]>([])
function getCategoryListData() {
  getCategoryTree({}).then((res) => {
    categoryList.value = res.data
  })
}

/** 静态日志数据（示例） */
const list = ref<TimesBidModel[]>([])

function getList(): void {
  if (loading.value)
    return
  loading.value = true
  const data = {
    ...queryParams.value,
    projectId: currentProjectId.value,
  } as TimesBidModel
  getTimesBidList(data).then((res) => {
    list.value = res.data.records
  }).finally(() => {
    loading.value = false
  })
}

function handlePreview(row: TimesBidModel) {
  router.push({
    name: 'Genbid',
    params: {
      timesBidId: row.id,
    },
  })
}

function handleBatchDownload(row: TimesBidModel) {
  download.get({
    url: `/api/project/downloadZip`,
    filename: `${Date.now()}.zip`,
    config: {
      params: {
        id: row.id,
        type: 1,
      },
    },
  })
  const url = `${window.webConfig.webApiBaseUrl || __API_URL__}/api/project/downloadZip`
  console.log(url)
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
      <el-table-column prop="id" label="编号" align="center" width="80" />

      <el-table-column prop="bidId" label="标书ids" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />

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

      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="success" size="small" @click="handlePreview(row)">
            查看
          </el-button>
          <el-button type="warning" size="small" @click="handleBatchDownload(row)">
            批量下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">

</style>
