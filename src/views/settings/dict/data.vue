<script setup lang="ts">
import type { ElForm, FormRules } from 'element-plus'
import type { DictDataModel } from '@/model/dict'
import { CircleClose, CirclePlus, Refresh, Search } from '@element-plus/icons-vue'
import { addDictData, DelDictData, getDictDataList, PutDictData } from '@/api/dict'

const loading = ref(false)
const queryRef = useTemplateRef('queryEl')
const route = useRoute()
const visible = ref(false)
const total = ref(0)
const isAdd = ref(false)
const ids = ref<number[]>([])
const names = ref<string[]>([])
const single = ref(true)
const multiple = ref(true)
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const submitLoading = ref(false)
const queryParams = ref<ListPageParamsWrapper<DictDataModel>>({
  page: {
    current: 1,
    size: 10,
  },
})
const form = ref<DictDataModel>({
  dictType: route.params.dictType as string,
  dictSort: 0,
  status: '0',
})
const currentDictType = computed(() => route.params.dictType as string)

const rules: FormRules = {
  dictType: [{ required: true, trigger: 'blur', message: '请输入字典类型' }],
  dictLabel: [{ required: true, trigger: 'change', message: '请输入字典标签' }],
  dictValue: [{ required: true, trigger: 'change', message: '请输入字典键值' }],
}
/** 静态日志数据（示例） */
const list = ref<DictDataModel[]>([])

function getList(): void {
  if (loading.value)
    return
  loading.value = true
  console.log(loading.value, 'loading.value')

  const data = {
    dictType: currentDictType.value,
    ...queryParams.value,
  }

  getDictDataList(data).then((res) => {
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

function handlePut(row: DictDataModel) {
  isAdd.value = false
  form.value = { ...row }
  visible.value = true
}

function handleDel(_ids: number[] | DictDataModel) {
  const delIds = Array.isArray(_ids) ? _ids : [_ids.dictCode!]
  const delNames = Array.isArray(_ids) ? names.value : [_ids.dictLabel!]
  confirmWarning(`是否确认删除字典标签为：${delNames.join(', ')} 的数据？`).then(() => {
    // 删除接口
    delMsgLoading(DelDictData(delIds), '正在删除 …').then(() => {
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

function handleSelectionChange(selection: DictDataModel[]) {
  ids.value = selection.map(item => item.dictCode!)
  names.value = selection.map(item => item.dictLabel!)
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

function cancel() {
  visible.value = false
}
function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (submitLoading.value)
        return
      submitLoading.value = true
      const api = isAdd.value ? addDictData : PutDictData
      const data = {
        dictCode: isAdd.value ? undefined : form.value.dictCode,
        dictType: form.value.dictType,
        dictLabel: form.value.dictLabel,
        dictValue: form.value.dictValue,
        dictSort: form.value.dictSort,
        status: form.value.status,
        remark: form.value.remark,
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
    dictType: currentDictType.value,
    dictSort: 0,
    status: '0',
  }
  resetForm(formRef.value)
  submitLoading.value = false
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div>
    <!-- 查询 -->
    <el-form ref="queryEl" :inline="true" :model="queryParams" @submit.prevent>
      <el-form-item>
        <el-input
          v-model="queryParams.dictLabel"
          placeholder="请输入字典标签查询"
          clearable
          style="width: 200px"
          @keyup.enter="getList"
        />
      </el-form-item>

      <el-form-item>
        <el-select v-model="queryParams.status" placeholder="请选择状态查询" clearable style="width: 160px" @change="getList">
          <el-option label="正常" value="0" />
          <el-option label="停用" value="1" />
        </el-select>
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

      <el-table-column align="center" prop="dictCode" label="字典编码" width="200" />

      <el-table-column align="center" prop="dictLabel" label="字典标签" width="200" />

      <el-table-column align="center" prop="dictValue" label="字典键值" width="200" />

      <el-table-column align="center" prop="dictSort" label="字典排序" width="200" sortable />

      <el-table-column align="center" prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === '0' ? 'success' : 'danger'">
            {{ row.status === '0' ? '正常' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip :formatter="$formatterTableEmpty" />

      <el-table-column label="创建人" align="center" prop="createdUserName" width="220">
        <template #default="{ row }">
          <span>{{ row.createdUserName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" prop="createdTime" width="180">
        <template #default="{ row }">
          <span>{{ row.createdTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="180" fixed="right" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handlePut(scope.row)">
            修改
          </el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.row)">
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
  </div>

  <el-dialog
    v-model="visible"
    :title="isAdd ? '新增字典数据' : '修改字典数据'"
    width="500"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form ref="formRef" :inline="true" :model="form" :rules="rules" class="large-form" label-width="100">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="字典标签" prop="dictType" style="width: 100%">
            <el-input v-model="form.dictType" disabled placeholder="请输入字典类型" size="large" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="字典标签" prop="dictLabel" style="width: 100%">
            <el-input v-model="form.dictLabel" placeholder="请输入字典标签" size="large" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="字典键值" prop="dictValue" style="width: 100%">
            <el-input v-model="form.dictValue" placeholder="请输入字典键值" size="large" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="显示排序" prop="dictSort" style="width: 100%">
            <el-input-number v-model="form.dictSort" controls-position="right" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="状态" prop="status" style="width: 100%">
            <el-radio-group v-model="form.status">
              <el-radio value="0" size="large">
                正常
              </el-radio>
              <el-radio value="1" size="large">
                停用
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注" prop="remark" style="width: 100%">
            <el-input
              v-model="form.remark"
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
</template>

<style scoped lang="scss">

</style>
