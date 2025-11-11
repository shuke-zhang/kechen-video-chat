<script setup lang="ts">
import type { ElForm, UploadRequestOptions } from 'element-plus'
import type { PredictModel } from '@/model/predict'
import { Refresh, Search, Upload } from '@element-plus/icons-vue'
import { DelCategory } from '@/api/category'
import { importPredictFile } from '@/api/predict'
import ImportFile from '@/components/importFile/importFile.vue'
import { withLoadingMessage } from '@/utils'
import PredictDialog from './predictDialog.vue'

const loading = ref(false)
const ids = ref<number[]>([])
const names = ref<string[]>([])
const single = ref(true)
const multiple = ref(true)
const queryRef = useTemplateRef('queryEl')
const visible = ref(false)
const predictVisible = ref(false)
const currentRow = ref<PredictModel>({})
const isAdd = ref(false)
const queryParams = ref<PredictModel>({

})
const form = ref<PredictModel>({})

/** 静态日志数据（示例） */
const list = ref<PredictModel[]>([])

function getList(): void {
  // if (loading.value)
  // return
  // loading.value = true
}

function handleAdd(row?: PredictModel) {
  visible.value = true
  isAdd.value = true
}

function handlePut(row: PredictModel) {
  isAdd.value = false
  form.value = {
    ...row,
  }
  visible.value = true
}

function handleDel(_ids: number[] | PredictModel) {
  const delIds = Array.isArray(_ids) ? _ids : [_ids.id!]
  const delNames = Array.isArray(_ids) ? names.value : [_ids.name!]
  confirmWarning(`是否确认删除类别名称为：${delNames.join(', ')} 的数据？`).then(() => {
    // 删除接口
    delMsgLoading(DelCategory(delIds), '正在删除 …').then(() => {
      loading.value = false
      ids.value = []
      names.value = []
      getList()
      showMessageSuccess('删除成功')
    }).finally(() => {
      loading.value = false
    })
  })
}

function handleImport($event: UploadRequestOptions) {
  withLoadingMessage(importPredictFile($event), '正在导入...').then(() => {
    console.log('导入成功')
  })
}

function handleImportSuccess() {
  console.log('导入成功')
}

function handlePredict(row: PredictModel) {
  predictVisible.value = true
  currentRow.value = row
}

function handleSelectionChange(selection: PredictModel[]) {
  ids.value = selection.map(item => item.id!)
  names.value = selection.map(item => item.name!)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

function retQuery(): void {
  queryParams.value = { }
  resetForm(queryRef.value)
  getList()
}

onMounted(() => {
  getList()
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

        <ImportFile class="ml-[12px] mr-[12px] flex-center" :accept="['YFJZ', 'YFJT']" :handle-upload="(handleImport as any)" @on-success="handleImportSuccess">
          <template #default>
            <el-button type="warning" :icon="Upload">
              导入
            </el-button>
          </template>
        </importFile>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="list"
      row-key="id"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column prop="id" label="编号" align="center" />

      <el-table-column label="创建人" align="center" prop="createdUserName" width="220">
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
          <el-button type="success" size="small" @click="handlePredict(row)">
            预测
          </el-button>
          <el-button v-if="false" type="success" size="small" @click="handleAdd(row)">
            新增
          </el-button>
          <el-button v-if="false" type="primary" size="small" @click="handlePut(row)">
            修改
          </el-button>
          <el-button v-if="false" type="danger" size="small" @click="handleDel(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <PredictDialog v-model:visible="predictVisible" :current-row="currentRow" />
  </div>
</template>

<style scoped lang="scss">

</style>
