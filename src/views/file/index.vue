<!-- LogPage.vue -->
<script setup lang="ts">
import type { ElForm } from 'element-plus'
import type { CategoryModel } from '@/model/category'
import type { FileModel } from '@/model/file'
import { CircleClose, CirclePlus, Refresh, Search } from '@element-plus/icons-vue'
import { getCategoryTree } from '@/api/category'
import { DelFile, getFileList } from '@/api/file'
import FileDialog from './fileDialog.vue'
import PreviewDialog from './previewDialog.vue'

const total = ref(0)
const loading = ref(false)
const ids = ref<number[]>([])
const names = ref<string[]>([])
const single = ref(true)
const multiple = ref(true)
const queryRef = useTemplateRef('queryEl')
const visible = ref(false)
const previewVisible = ref(false)
const previewForm = ref<{
  docUrl: string
  type: 'word' | 'content'
  content: string
}>({
  docUrl: '',
  type: 'word',
  content: '',
})
const isAdd = ref(false)
const httpRel = /^https?:\/\/[^/]+\/upload\//
const queryParams = ref<ListPageParamsWrapper<FileModel>>({
  page: {
    current: 1,
    size: 10,
  },
})
const currentRow = ref<FileModel>({})
/** 静态日志数据（示例） */
const list = ref<FileModel[]>([])
const categoryList = ref<CategoryModel[]>([])
function getList(): void {
  if (loading.value)
    return
  loading.value = true
  getFileList(queryParams.value).then((res) => {
    list.value = res.data.records
    total.value = res.data.total
  }).finally(() => {
    loading.value = false
  })
}

function getCategoryListData() {
  getCategoryTree({}).then((res) => {
    categoryList.value = res.data
  })
}

function handleAddDict() {
  visible.value = true
  isAdd.value = true
}

function handlePut(row: FileModel) {
  isAdd.value = false
  currentRow.value = toRaw(row)
  visible.value = true
}

function handleDel(_ids: number[] | FileModel) {
  const delIds = Array.isArray(_ids) ? _ids : [_ids.id!]
  const delNames = Array.isArray(_ids) ? names.value : [_ids.name!]
  confirmWarning(`是否确认删除文件名称为：${delNames.join(', ')} 的数据？`).then(() => {
    // 删除接口
    delMsgLoading(DelFile(delIds), '正在删除 …').then(() => {
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
function handleSelectionChange(selection: FileModel[]) {
  ids.value = selection.map(item => item.id!)
  names.value = selection.map(item => item.name!)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

function retQuery(): void {
  queryParams.value = { page: {
    current: 1,
    size: 10,
  } }
  resetForm(queryRef.value)
  getList()
}

function handlePreview(row: FileModel) {
  previewVisible.value = true
  previewForm.value.type = row.fileLink ? 'word' : 'content'
  previewForm.value.docUrl = `${__API_URL__}/upload/${row.fileLink}` || ''
  console.log(previewForm.value.docUrl, '预览')

  previewForm.value.content = row.fileContent || ''
}

onMounted(() => {
  getList()
  getCategoryListData()
  // showMessageError('测试错误消息提示')
})
</script>

<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-form ref="queryEl" :inline="true" :model="queryParams" @submit.prevent>
      <el-form-item>
        <el-input
          v-model="queryParams.name"
          placeholder="请输入文件名称查询"
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
        <el-button type="success" :icon="CirclePlus" @click="handleAddDict">
          新增
        </el-button>
        <el-button type="danger" :icon="CircleClose" @click="handleDel(ids)">
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

      <el-table-column prop="id" label="文件编号" align="center" width="90" />

      <el-table-column prop="name" label="文件名" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />

      <el-table-column prop="typeName" label="类名" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />

      <el-table-column label="文件方式" align="center" width="120">
        <template #default="{ row }">
          <el-tag :type="row.fileType === 0 ? 'success' : 'warning'">
            {{ row.fileType === 0 ? '文件上传' : '内容填写' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="文件链接" align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <span>{{ row.fileLink || '-' }}</span>
        </template>
      </el-table-column>

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

      <el-table-column label="操作" align="center" width="200" fixed="right" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-button type="success" size="small" @click="handlePreview(row)">
            预览
          </el-button>

          <el-button type="primary" size="small" @click="handlePut(row)">
            修改
          </el-button>
          <el-button type="danger" size="small" @click="handleDel(row)">
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

    <FileDialog
      v-model:visible="visible"
      :is-add="isAdd"
      :category-list="categoryList"
      :current-row="currentRow"
      @success="getList"
    />

    <PreviewDialog
      v-model:visible="previewVisible"
      :doc-url="previewForm.docUrl" :type="previewForm.type"
      :content-text="previewForm.content"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
