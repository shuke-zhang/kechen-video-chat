<script setup lang="ts">
// /api/predict/list
import type { ElForm } from 'element-plus'
import type { AddPredictResponseData } from '@/model/predict'
import { Back, Refresh, Search } from '@element-plus/icons-vue'
import { getPredictList } from '@/api/predict'

const router = useRouter()
const list = ref<AddPredictResponseData[]>([])
const loading = ref(false)
const total = ref(0)
const single = ref(true)
const multiple = ref(true)
const queryRef = useTemplateRef('queryEl')
const queryParams = ref<ListPageParamsWrapper<AddPredictResponseData>>({
  page: {
    size: 10,
    current: 1,
  },
})
function getList() {
  if (loading.value)
    return
  loading.value = true
  getPredictList(queryParams.value).then((res) => {
    total.value = res.data.total
    list.value = res.data.records
  }).finally(() => {
    loading.value = false
  })
}

function handleSelectionChange(selection: AddPredictResponseData[]) {
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
  getList()
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-form ref="queryEl" :inline="true" :model="queryParams" class="flex" @submit.prevent>
      <el-form-item>
        <el-input
          v-model="queryParams.bqName "
          placeholder="请输入名称查询"
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

      <el-form-item class="ml-auto">
        <el-button type="" plain :icon="Back" @click="router.push('/predict')">
          返回
        </el-button>
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

      <el-table-column prop="code" label="项目编码" align="center" show-overflow-tooltip />

      <el-table-column prop="projectName" label="项目名称" align="center" show-overflow-tooltip />

      <el-table-column prop="bqName" label="名称" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" min-width="120" />

      <el-table-column prop="capPrice" label="拦标价" align="center" show-overflow-tooltip :formatter="$formatterTablePrice" />

      <el-table-column prop="total" label="总数" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />

      <el-table-column prop="companionUnitRate" label="陪标比率" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />

      <el-table-column prop="otherRateStr" label="其他家比率" align="center" min-width="100" show-overflow-tooltip :formatter="$formatterTableEmpty" />

      <el-table-column prop="resultValue" label="F值" align="center" :formatter="$formatterTableEmpty" min-width="160">
        <template #default="{ row }">
          <span class="text-[20px] text-green-500">{{ row.resultValue }}</span>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-model:page-num="queryParams.page.current"
      v-model:page-size="queryParams.page.size"
      :total="total"
      @pagination="getList"
    />
  </div>
</template>

<style scoped lang="scss">
.s {
  text-align: end;
}
</style>
