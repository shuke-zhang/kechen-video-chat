<script setup lang="ts">
import type { ElForm } from 'element-plus'
import type { CategoryModel } from '@/model/category'
import type { ProjectModel } from '@/model/project'
import { Refresh, Search } from '@element-plus/icons-vue'
import { getCategoryTree } from '@/api/category'
import { getGenbidList } from '@/api/genbid'
import { download } from '@/utils/request/download'

const route = useRoute()
const loading = ref(false)
const queryRef = useTemplateRef('queryEl')
const queryParams = ref<ProjectModel>({

})
const currentProjectId = computed(() => route.params.id as string)

const categoryList = ref<CategoryModel[]>([])
function getCategoryListData() {
  getCategoryTree({}).then((res) => {
    categoryList.value = res.data
  })
}

/** 静态日志数据（示例） */
const list = ref<ProjectModel[]>([])

function getList(): void {
  if (loading.value)
    return
  loading.value = true
  const data = {
    id: currentProjectId.value,
    ...queryParams.value,
  }
  getGenbidList(data).then((res) => {
    list.value = res.data.records
  }).finally(() => {
    loading.value = false
  })
}

function handleBatchDownload(row: ProjectModel) {
  download.get({
    url: `/api/project/downloadZip`,
    filename: `${row.projectName}-${Date.now()}.zip`,
    config: {
      params: {
        id: row.id,
        type: 0,
      },
    },
  })
  const url = `${__API_URL__}/api/project/downloadZip`
  console.log(url)
}

function retQuery(): void {
  queryParams.value = { }
  resetForm(queryRef.value)
  getList()
}

onMounted(() => {
  getList()
  getCategoryListData()
})
</script>

<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-form ref="queryEl" :inline="true" :model="queryParams" @submit.prevent>
      <el-form-item>
        <el-input
          v-model="queryParams.projectName "
          placeholder="请输入项目名称查询"
          clearable
          style="width: 200px"
          @keyup.enter="getList"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="getList">
          查询
        </el-button>
        <el-button type="primary" plain :icon="Refresh" @click="retQuery">
          查询重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="list"
      row-key="id"
      style="width: 100%"
    >
      <el-table-column prop="id" label="项目编号" align="center" />

      <el-table-column prop="projectName" label="项目名称" align="center" show-overflow-tooltip />

      <el-table-column prop="projectDuration" label="项目工期" align="center" :formatter="$formatterTableWithSuffix('天')" />

      <el-table-column prop="genTimes" label="生词次数" align="center" />

      <el-table-column prop="genIds" label="生成的次数" align="center" :formatter="$formatterTableEmpty" min-width="100" />

      <el-table-column prop="genIds" label="计划日期" align="center" show-overflow-tooltip>
        <template #default="{ row }">
          {{ `${row.projectStartTime} 至 ${row.projectEndTime}` }}
        </template>
      </el-table-column>

      <el-table-column prop="projectDesc" label="工程概况" align="center" show-overflow-tooltip />

      <el-table-column prop="projectAddress" label="项目建设地址" align="center" show-overflow-tooltip min-width="120" />

      <el-table-column prop="projectRequire" label="工期要求" align="center" show-overflow-tooltip />

      <el-table-column prop="projectCommit" label="工期承诺" align="center" show-overflow-tooltip />

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
