<!-- LogPage.vue -->
<script setup lang="ts">
import type { CascaderValue, ElForm, FormRules } from 'element-plus'
import type { CategoryModel } from '@/model/category'
import { CircleClose, CirclePlus, Refresh, Search } from '@element-plus/icons-vue'
import { addCategory, DelCategory, getCategoryTree, PutCategory } from '@/api/category'

const cascaderRef = useTemplateRef('cascaderRef')
const loading = ref(false)
const ids = ref<number[]>([])
const names = ref<string[]>([])
const single = ref(true)
const multiple = ref(true)
const queryRef = useTemplateRef('queryEl')
const visible = ref(false)
const isAdd = ref(false)
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const submitLoading = ref(false)
const queryParams = ref<CategoryModel>({

})
const form = ref<CategoryModel>({
  sort: 0,
})
const rules: FormRules = {
  dictName: [{ required: true, trigger: 'change', message: '请输入类别名称' }],
  dictType: [{ required: true, trigger: 'blur', message: '请输入类别类型' }],
}
/** 静态日志数据（示例） */
const list = ref<CategoryModel[]>([])

function getList(): void {
  if (loading.value)
    return
  loading.value = true
  getCategoryTree(queryParams.value).then((res) => {
    list.value = res.data
  }).finally(() => {
    loading.value = false
  })
}

function handleCascader(val: CascaderValue) {
  if (Array.isArray(val)) {
    form.value.parentId = val[val.length - 1] as number
    form.value.containParent = val.join(',')
  }
}

function handleAddDict(row?: CategoryModel) {
  form.value.parentId = row ? row.id : list.value[list.value.length - 1].id
  form.value.containParent = getNodeFullPath(form.value.parentId || 0, list.value).join(',')

  visible.value = true
  isAdd.value = true
}

function handlePut(row: CategoryModel) {
  isAdd.value = false
  form.value = {
    ...row,
    sort: Number(row.sort),
  }
  visible.value = true
}

function handleDel(_ids: number[] | CategoryModel) {
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
function handleSelectionChange(selection: CategoryModel[]) {
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

function cancel() {
  reset()
  visible.value = false
}
function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (submitLoading.value)
        return
      submitLoading.value = true
      const api = isAdd.value ? addCategory : PutCategory
      const data = {
        id: form.value.id,
        name: form.value.name,
        parentId: form.value.parentId,
        sort: form.value.sort,
        containParent: form.value.containParent,
      }

      api(data).then(() => {
        showMessageSuccess('操作成功')
        visible.value = false
        reset()
        getList()
      }).finally(() => {
        submitLoading.value = false
      })
    }
  })
}

function reset() {
  form.value = {
    sort: 0,
  }
  resetForm(formRef.value)
  submitLoading.value = false
}

/**
 * 递归获取选中节点的所有父级节点
 *
 * @param value 当前选中节点的 ID
 * @param options 树形数据，包含父级节点和子级节点
 * @returns 当前节点的所有父级节点的值
 */
function getNodeFullPath(value: number, options: any[]): number[] {
  const path: number[] = []

  const dfs = (nodes: any[]): boolean => {
    for (const node of nodes) {
      path.push(node.id) // 先加入路径

      if (node.id === value) {
        return true // 找到目标节点
      }

      if (node.children && dfs(node.children)) {
        return true // ⬅️ 子树中找到了，路径保留
      }

      path.pop() // ❗没找到，需要回溯
    }
    return false
  }

  dfs(options)
  return path
}

onMounted(() => {
  getList()
  // showMessageError('测试错误消息提示')
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
        <el-button type="success" :icon="CirclePlus" @click="handleAddDict()">
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
      row-key="id"
      default-expand-all
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column prop="id" label="类别编号" align="center" />

      <el-table-column prop="name" label="类别名称" align="center" show-overflow-tooltip />

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
          <el-button type="success" size="small" @click="handleAddDict(row)">
            新增
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

    <el-dialog
      v-model="visible"
      :title="isAdd ? '新增类别' : '修改类别'"
      width="500"
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form ref="formRef" :inline="true" :model="form" :rules="rules" class="large-form" label-width="100">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="父级类别" prop="name" style="width: 100%">
              <el-cascader
                ref="cascaderRef"
                v-model="form.parentId"
                :props="{
                  label: 'name',
                  value: 'id',
                  checkStrictly: true,
                }"
                :options="list"
                size="large"
                style="width: 100%;"
                @change="handleCascader"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="类别名称" prop="name" style="width: 100%">
              <el-input v-model="form.name" placeholder="请输入类别名称" size="large" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="排序" prop="name" style="width: 100%">
              <el-input-number
                v-model="form.sort"
                :min="0"
                controls-position="right"
                size="large"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">
            取 消
          </el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
            提 交
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">

</style>
