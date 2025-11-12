<script setup lang="ts">
import type { ElForm, UploadRequestOptions } from 'element-plus'
import type { importPredictModel } from '@/model/predict'
import { Refresh, Search, Upload } from '@element-plus/icons-vue'
import { importPredictFile } from '@/api/predict'
import ImportFile from '@/components/importFile/importFile.vue'
import { withLoadingMessage } from '@/utils'
import PredictDialog from './predictDialog.vue'

const loading = ref(false)
const names = ref<string[]>([])
const single = ref(true)
const multiple = ref(true)
const queryRef = useTemplateRef('queryEl')
const predictVisible = ref(false)
const currentRow = ref<importPredictModel>({})
const currentProjectName = ref('')
const queryParams = ref<ListPageParamsWrapper<importPredictModel>>({
  page: {
    size: 10,
    current: 1,
  },
})
const importFileList = ref<importPredictModel[]>([])

const clientPage = computed(() => {
  const k = String(queryParams.value.name || '').trim().toLowerCase()
  const list = importFileList.value
  const filtered = k ? list.filter(r => String(r?.name || '').toLowerCase().includes(k)) : list
  const start = (queryParams.value.page.current - 1) * queryParams.value.page.size
  const end = start + queryParams.value.page.size
  return { rows: filtered.slice(start, end), total: filtered.length }
})

function handleImport($event: UploadRequestOptions) {
  withLoadingMessage(importPredictFile($event), '正在导入...').then((res) => {
    importFileList.value = res.data.list
    currentProjectName.value = res.data.originalName
    console.log('导入成功')
  })
}

function handleImportSuccess() {
  console.log('导入成功')
}

function handlePredict(row: importPredictModel) {
  predictVisible.value = true
  currentRow.value = row
}

function handleHistory() {
}

function handleSelectionChange(selection: importPredictModel[]) {
  names.value = selection.map(item => item.name!)
  single.value = selection.length !== 1
  multiple.value = !selection.length
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

onMounted(() => {
})
</script>

<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-form ref="queryEl" :inline="true" :model="queryParams" @submit.prevent>
      <el-form-item>
        <el-input
          v-model="queryParams.name "
          placeholder="请输入类别名称查询"
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

        <ImportFile class="ml-[12px] mr-[12px] flex-center" :accept="['YFJZ', 'YFJT']" :handle-upload="(handleImport as any)" @on-success="handleImportSuccess">
          <template #default>
            <el-button type="warning" :icon="Upload">
              导入
            </el-button>
          </template>
        </importFile>

        <el-button type="info" @click="handleHistory">
          历史记录
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
      <el-table-column type="selection" width="55" />

      <el-table-column prop="code" label="编号" align="center" />

      <el-table-column prop="name" label="名称" align="center" />

      <el-table-column label="操作" align="center" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="success" size="small" @click="handlePredict(row)">
            预测
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="clientPage.total > 0"
      v-model:page-num="queryParams.page.current"
      v-model:page-size="queryParams.page.size"
      :total="clientPage.total"
      @pagination="() => {}"
    />

    <PredictDialog v-model:visible="predictVisible" :current-row="currentRow" :current-project-name="currentProjectName" />
  </div>
</template>

<style scoped lang="scss">

</style>
