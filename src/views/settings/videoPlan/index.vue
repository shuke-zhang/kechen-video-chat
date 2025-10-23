<!-- UserPage.vue -->
<script setup lang="ts">
import type { ElForm } from 'element-plus'
import type { VideoCategoryModel } from '@/model/videoCategory'
import type { VideoPlanModel } from '@/model/videoPlan'
import { CircleClose, CirclePlus, Refresh, Search } from '@element-plus/icons-vue'
import { getVideoCategoryTree } from '@/api/videoCategory'
import { DelVideoPlan, getVideoPlanList } from '@/api/videoPlan'
import UserDialog from './planDialog.vue'

const { sys_user_sex } = useDict('sys_user_sex')

const total = ref(0)
const list = ref<VideoPlanModel[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const isAdd = ref(false)
const dialogData = ref<VideoPlanModel>({})
const ids = ref<number[]>([])
const names = ref<string[]>([])
const single = ref(true)
const multiple = ref(true)
const videoTypeList = ref<VideoCategoryModel[]>([])
const queryRef = useTemplateRef('queryEl')
const queryParams = ref<ListPageParamsWrapper<VideoPlanModel>>({
  page: {
    current: 1,
    size: 10,
  },
})

function getList(): void {
  if (loading.value)
    return
  loading.value = true
  getVideoPlanList(queryParams.value).then((res) => {
    list.value = res.data.records
    total.value = res.data.total
  }).finally(() => {
    loading.value = false
  })
}

function getVideoType() {
  getVideoCategoryTree().then((res) => {
    videoTypeList.value = res.data
  })
}

function getPlanTypeLabel(planType: number): string {
  const item = findNodeById(videoTypeList.value, planType)
  return item ? item.name || '' : ''
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

function handleAdd(): void {
  isAdd.value = true
  dialogData.value = {}
  dialogVisible.value = true
}

function handlePut(row: VideoPlanModel): void {
  isAdd.value = false
  dialogData.value = { ...row }
  dialogVisible.value = true
}

function handleDel(_ids: number[] | VideoPlanModel): void {
  const delIds = Array.isArray(_ids) ? _ids : [_ids.id!]
  const delNames = Array.isArray(_ids) ? names.value : [_ids.name!]
  confirmWarning(`是否确认删除视频方案：${delNames.join(', ')}？`).then(() => {
    delMsgLoading(DelVideoPlan(delIds), '删除中...').then(() => {
      loading.value = false
      ids.value = []
      names.value = []
      single.value = true
      multiple.value = true
      getList()
    })
  })
}

function handleSelectionChange(selection: VideoPlanModel[]): void {
  ids.value = selection.map(i => i.id!)
  names.value = selection.map(i => i.name!)
  single.value = selection.length !== 1
  multiple.value = selection.length === 0
}

onMounted(() => {
  getList()
  getVideoType()
})
</script>

<template>
  <div class="container">
    <!-- 查询 -->
    <el-form ref="queryEl" :inline="true" :model="queryParams" @submit.prevent>
      <el-form-item>
        <el-input
          v-model="queryParams.name"
          placeholder="请输入方案名查询"
          clearable
          style="width: 220px"
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
        <el-button type="success" :icon="CirclePlus" @click="handleAdd">
          新增
        </el-button>
        <el-button type="danger" :disabled="ids.length <= 0" :icon="CircleClose" @click="handleDel(ids)">
          删除
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="list"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column prop="id" label="方案编号" align="center" width="90" />

      <el-table-column prop="name" label="方案名称" align="center" width="140" show-overflow-tooltip />

      <el-table-column prop="planType" label="视频类别" align="center" width="140">
        <template #default="{ row }">
          {{ getPlanTypeLabel(row.planType) }}
        </template>
      </el-table-column>

      <el-table-column prop="videoName" label="视频名称" align="center" width="140" />

      <el-table-column prop="createdUserName" label="创建人" align="center" width="220" />

      <el-table-column prop="createdTime" label="创建时间" align="center" width="220" />

      <el-table-column align="center" label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handlePut(row)">
            修改
          </el-button>
          <el-button size="small" type="danger" @click="handleDel(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      v-show="total > 0"
      v-model:page="queryParams.page.current"
      v-model:limit="queryParams.page.size"
      :total="total"
      @pagination="getList"
    />

    <!-- 弹窗 -->
    <UserDialog
      v-model="dialogVisible"
      :is-add="isAdd"
      :sys-user-sex="sys_user_sex"
      @success="getList"
    />
  </div>
</template>

<style scoped lang="scss">
.container {
  padding: 16px;
}
.mb-3 {
  margin-bottom: 12px;
}
</style>
