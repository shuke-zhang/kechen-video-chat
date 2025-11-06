<!-- LogPage.vue -->
<script setup lang="ts">
import type { ElForm, FormRules } from 'element-plus'
import type { DictModel } from '@/model/dict'
import { CircleClose, CirclePlus, Refresh, Search } from '@element-plus/icons-vue'
import { addDict, DelDict, getDictList, PutDict } from '@/api/dict'

const total = ref(0)
const loading = ref(false)
const ids = ref<number[]>([])
const names = ref<string[]>([])
const single = ref(true)
const multiple = ref(true)
const queryRef = useTemplateRef('queryEl')
const router = useRouter()
const visible = ref(false)
const isAdd = ref(false)
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const submitLoading = ref(false)
const queryParams = ref<ListPageParamsWrapper<DictModel>>({
  page: {
    current: 1,
    size: 10,
  },
})
const form = ref<DictModel>({})
const rules: FormRules = {
  dictName: [{ required: true, trigger: 'change', message: '请输入类别名称' }],
  dictType: [{ required: true, trigger: 'blur', message: '请输入类别类型' }],
}
/** 静态日志数据（示例） */
const list = ref<DictModel[]>([])
/** 自定义跳转详情 */
function linkTo(row: DictModel) {
  router.push({
    name: 'DictData',
    params: {
      dictType: row.dictType,
    },
  })
}

function getList(): void {
  if (loading.value)
    return
  loading.value = true
  getDictList(queryParams.value).then((res) => {
    list.value = res.data.records
    total.value = res.data.total
  }).finally(() => {
    loading.value = false
  })
}

function handleAddDict() {
  visible.value = true
  isAdd.value = true
}

function handlePut(row: DictModel) {
  isAdd.value = false
  form.value = { ...row }
  visible.value = true
}

function handleDel(_ids: number[] | DictModel) {
  const delIds = Array.isArray(_ids) ? _ids : [_ids.id!]
  const delNames = Array.isArray(_ids) ? names.value : [_ids.dictType!]
  confirmWarning(`是否确认删除类别名称为：${delNames.join(', ')} 的数据？`).then(() => {
    // 删除接口
    delMsgLoading(DelDict(delIds), '正在删除 …').then(() => {
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
function handleSelectionChange(selection: DictModel[]) {
  ids.value = selection.map(item => item.id!)
  names.value = selection.map(item => item.dictName!)
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

function cancel() {
  visible.value = false
}
function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (submitLoading.value)
        return
      submitLoading.value = true
      const api = isAdd.value ? addDict : PutDict
      const data = {
        id: form.value.id,
        dictName: form.value.dictName,
        dictType: form.value.dictType,
        description: form.value.description,
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
  form.value = {}
  resetForm(formRef.value)
  submitLoading.value = false
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
          v-model="queryParams.dictName"
          placeholder="请输入类别名称查询"
          clearable
          style="width: 200px"
          @keyup.enter="getList"
        />
      </el-form-item>

      <!--
      <el-form-item>
        <el-date-picker
          v-model="queryParams.dateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          size="large"
        />
      </el-form-item> -->

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

      <el-table-column prop="id" label="类别编号" align="center" width="90" />

      <el-table-column prop="dictName" label="类别名称" align="center" show-overflow-tooltip />

      <el-table-column align="center" prop="dictType" label="类别类型" min-width="180">
        <template #default="scope">
          <el-button link type="primary" @click="linkTo(scope.row)">
            {{ scope.row.dictType }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column prop="description" label="描述" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />

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

      <el-table-column label="操作" align="center" width="140" fixed="right" class-name="small-padding fixed-width">
        <template #default="{ row }">
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
            <el-form-item label="类别名称" prop="dictName" style="width: 100%">
              <el-input v-model="form.dictName" placeholder="请输入类别名称" size="large" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="类别类型" prop="dictType" style="width: 100%">
              <el-input v-model="form.dictType" placeholder="请输入类别类型" size="large" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="描述" prop="description" style="width: 100%">
              <el-input
                v-model="form.description"
                style="width: 240px"
                type="textarea"
                placeholder="请输入内容"
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
