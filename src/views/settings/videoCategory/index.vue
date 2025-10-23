<!-- VideoCategoryPage.vue -->
<script setup lang="ts">
import type { ElForm } from 'element-plus'
import type { VideoCategoryModel } from '@/model/videoCategory'

import { CircleClose, CirclePlus, Refresh, Search } from '@element-plus/icons-vue'
import { DelVideoCategory, getVideoCategoryTree } from '@/api/videoCategory'
import { getCurrentNodeTree } from '@/utils'
import VideoCategoryDialog from './videoCategoryDialog.vue'

const { treat_project_type } = useDict('treat_project_type')

/** 分页/弹窗等状态 */
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const isAdd = ref(false)
const dialogData = ref<VideoCategoryModel>({})
const ids = ref<number[]>([])
const names = ref<string[]>([])
const single = ref(true)
const multiple = ref(true)
const currentPreTree = ref<VideoCategoryModel[] | null>(null)
/** 查询表单 */
const queryRef = useTemplateRef('queryEl')
const queryParams = ref<VideoCategoryModel>({

})
/** 静态数据：模拟类别列表 */
const list = ref<VideoCategoryModel[]>([])

/** 获取列表（静态模拟） */
function getTree(): void {
  if (loading.value)
    return
  loading.value = true
  getVideoCategoryTree(queryParams.value).then((res) => {
    list.value = res.data
  }).finally(() => {
    loading.value = false
  })
}

function handleSelectionChange(selection: VideoCategoryModel[]) {
  ids.value = selection.map(item => item.id!)
  names.value = selection.map(item => item.name!)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 重置查询 */
function retQuery(): void {
  queryParams.value = { }
  resetForm(queryRef.value)
  getTree()
}

/** 打开新增 */
function handleAdd(_event: MouseEvent, row?: VideoCategoryModel): void {
  isAdd.value = true
  dialogData.value = {}
  dialogVisible.value = true

  currentPreTree.value = row?.id ? getCurrentNodeTree<VideoCategoryModel>(list.value, row!.id!) as VideoCategoryModel[] : list.value
}

/** 打开编辑 */
function handlePut(row: VideoCategoryModel): void {
  // 是否是顶层目录 使用时需要 !isTopLevel
  isAdd.value = false
  dialogData.value = { ...row }
  currentPreTree.value = list.value
  dialogVisible.value = true
}

/** 删除（支持批量） */
function handleDel(_ids: number[] | VideoCategoryModel): void {
  const delIds = Array.isArray(_ids) ? _ids : [_ids.id!]
  const hasChildren = list.value.some(item => delIds.includes(item.id!) && item.children && item.children.length > 0)
  if (hasChildren) {
    showMessageError('请先删除所选项下的子类数据')
    return
  }
  const selectedNames = getTreeFlatList(list.value).filter(el => delIds.includes(el.id!)).map(it => it.name).join('、')

  confirmWarning(`是否确认删除所选视频类别：${selectedNames} 的数据？`).then(() => {
    // 删除接口
    delMsgLoading(DelVideoCategory(delIds), '正在删除 …').then(() => {
      loading.value = false
      ids.value = []
      names.value = []
      getTree()
      showMessageSuccess('删除成功')
    }).finally(() => {
      loading.value = false
    })
  })
}

/** 初次加载 */
onMounted(() => {
  total.value = list.value.length
  getTree()
})
</script>

<template>
  <div>
    <!-- 查询区域 -->
    <el-form ref="queryEl" :inline="true" :model="queryParams" @submit.prevent>
      <el-form-item>
        <el-input
          v-model="queryParams.name"
          placeholder="请输入类别名称查询"
          clearable
          style="width: 220px"
          @keyup.enter="getTree"
        />
      </el-form-item>

      <!-- <el-form-item>
        <el-select v-model="queryParams.treatProjectName" placeholder="请选择诊疗项" clearable size="large" style="width: 160px" @change="getTree">
          <el-option v-for="it in treat_project_type" :key="it.value" :label="it.label" :value="it.value" />
        </el-select>
      </el-form-item> -->

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="getTree">
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
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      default-expand-all
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column align="center" prop="id" label="编号" min-width="50" />

      <!-- ② 真正显示名称的列：不会再有缩进，顶格对齐 -->
      <el-table-column align="center" label="类别名称" class-name="name-col">
        <template #default="{ row }">
          <span class="w-full flex flex-center" :class="{ 'pl-[20px]': row.parentId }">{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="treatProjectName" label="诊疗项" :formatter="$formatterTableEmpty" />

      <el-table-column align="center" prop="createdTime" label="创建时间" min-width="180" />
      <el-table-column align="center" label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="success" @click="handleAdd($event, row)">
            新增
          </el-button>
          <el-button size="small" type="primary" @click="handlePut(row)">
            修改
          </el-button>
          <el-button :disabled="!multiple" size="small" type="danger" @click="handleDel(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗：把完整类别列表作为可选父级传入 -->
    <VideoCategoryDialog
      v-model="dialogVisible"
      :is-add="isAdd"
      :data="dialogData"
      :all-categories="list"
      :video-category-tree="currentPreTree"
      :visit-list="treat_project_type"
      @success="getTree"
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
