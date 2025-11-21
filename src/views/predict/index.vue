<script setup lang="ts">
import type { ElForm, UploadRequestOptions } from 'element-plus'
import type { AddPredictResponseData, importPredictModel } from '@/model/predict'
import { Refresh, Search, Upload } from '@element-plus/icons-vue'
import { importPredictFile } from '@/api/predict'
import ImportFile from '@/components/importFile/importFile.vue'
import { withLoadingMessage } from '@/utils'
import PredictDialog from './predictDialog.vue'
import PredictResDialog from './predictResDialog.vue'

const router = useRouter()
const loading = ref(false)
const ids = ref<string[]>([])
const names = ref<string[]>([])
const single = ref(true)
const multiple = ref(true)
const queryRef = useTemplateRef('queryEl')
const predictVisible = ref(false)
const predictResVisible = ref(false)
const projectList = ref<importPredictModel[]>([])
const currentProjectName = ref('')
const queryParams = ref<ListPageParamsWrapper<importPredictModel>>({
  page: {
    size: 10,
    current: 1,
  },
})
const importFileList = ref<importPredictModel[]>([])
const predictResList = ref<AddPredictResponseData[]>([])

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
    importFileList.value = res.data.tree
    currentProjectName.value = res.data.originalName
    setSession('importFileList', res.data.tree)
    setSession('currentProjectName', res.data.originalName)
    console.log('导入成功')
  })
}

function handleImportSuccess() {
  console.log('导入成功')
}

function handlePredict() {
  // currentRow.value = row

  predictVisible.value = true
}

/**
 * 预测结果回调
 */
function handlePredictSuccess(list: AddPredictResponseData[]) {
  predictResVisible.value = true
  predictResList.value = list
}

function handleHistory() {
  router.push('/predict/history')
}

function handleSelectionChange(selection: importPredictModel[]) {
  ids.value = selection.map(item => item.code!)
  names.value = selection.map(item => item.name!)
  projectList.value = selection.map((item) => {
    return {
      ...item,
      bqName: item.name || '',
      totalPrice: item.rate,
      capPrice: item.topUnitPrice,
    }
  }).filter(it => !!it.bqName)
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
  importFileList.value = getSession<importPredictModel[]>('importFileList', [])!
  currentProjectName.value = getSession<string>('currentProjectName', '')!
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

        <el-button type="success" :disabled="ids.length <= 0" @click="handlePredict">
          预测
        </el-button>

        <el-button type="info" @click="handleHistory">
          历史记录
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :tree-props="{
        checkStrictly: false,
        children: 'children',
      }"
      :data="clientPage.rows"
      row-key="code"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column label="编号" align="center" width="160">
        <template #default="{ row }">
          <span>{{ row.children && row.children.length > 0 ? row.code : row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />

      <el-table-column prop="feature" label="项目特征" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />

      <el-table-column prop="rate" label="综合单价" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />

      <el-table-column prop="total" label="综合总价" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />

      <el-table-column prop="topUnitPrice" label="拦标价" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />
    </el-table>

    <Pagination
      v-show="clientPage.total > 0"
      v-model:page-num="queryParams.page.current"
      v-model:page-size="queryParams.page.size"
      :total="clientPage.total"
      @pagination="() => {}"
    />

    <PredictDialog
      v-model:visible="predictVisible"
      :project-list="projectList"
      :current-project-name="currentProjectName"
      @success="handlePredictSuccess"
    />

    <PredictResDialog
      v-model:visible="predictResVisible" :list="predictResList"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.el-table th) {
  height: 30px !important;
  padding: 0 !important;
}

/* 表体行高度 */
:deep(.el-table .el-table__row) {
  height: 30px !important;
}

/* 单元格的内边距也要改，不然撑高 */
:deep(.el-table__cell) {
  line-height: 35px !important;
  padding: 0 !important;
}
</style>
