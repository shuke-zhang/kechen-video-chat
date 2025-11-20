<script setup lang="ts">
import type { ElForm } from 'element-plus'
import type { EmployeeModel } from '@/model/employee'
import { Delete, Plus, Refresh, Search } from '@element-plus/icons-vue'
import {
  addEmployee,
  DelEmployee,
  getEmployeeList,
  PutEmployee,
} from '@/api/employee'
import { getReviewProjectLabel } from '@/api/reviewProject'
import { EDUCATION_LIST, PROFESSIONAL_TITLE_LIST } from '@/utils'

/* ------------------------- 列表部分 ------------------------- */

const loading = ref(false)
const queryRef = useTemplateRef('queryEl')

const queryParams = ref<ListPageParamsWrapper<EmployeeModel>>({
  page: { current: 1, size: 10 },
})

const positionList = ref()
const employeeList = ref<EmployeeModel[]>([])
const multiple = ref(true)
const selectedIds = ref<number[]>([])

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const currentRow = ref<EmployeeModel>({})

const clientPage = computed(() => {
  const k = String(queryParams.value.position || '').trim().toLowerCase()
  const list = employeeList.value
  const filtered = k
    ? list.filter(r => String(r?.position || '').toLowerCase().includes(k))
    : list

  const start = (queryParams.value.page.current - 1) * queryParams.value.page.size
  const end = start + queryParams.value.page.size
  return { rows: filtered.slice(start, end), total: filtered.length }
})

async function getList() {
  loading.value = true
  try {
    const res = await getEmployeeList(queryParams.value)
    employeeList.value = res.data.records
  }
  finally {
    loading.value = false
  }
}

function getPositionList() {
  getReviewProjectLabel().then((res) => {
    positionList.value = res.data.position
  })
}

function retQuery() {
  queryParams.value.page.current = 1
  resetForm(queryRef.value)
  getList()
}

function handleAdd() {
  dialogMode.value = 'add'
  currentRow.value = {}
  dialogVisible.value = true
}

function handleEdit(row: EmployeeModel) {
  dialogMode.value = 'edit'
  currentRow.value = { ...row }
  dialogVisible.value = true
}

function handleDelete() {
  if (!selectedIds.value.length) {
    ElMessage.warning('请选择要删除的数据')
    return
  }
  ElMessageBox.confirm('确认删除选中的员工吗？', '提示').then(async () => {
    await DelEmployee(selectedIds.value)
    ElMessage.success('删除成功')
    getList()
  })
}

function handleSelectionChange(selection: EmployeeModel[]) {
  selectedIds.value = selection.map(item => item.id!)
  multiple.value = !selection.length
}

/* ---------------------- 内置 EmployeeDialog ---------------------- */

const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const subLoading = ref(false)

const form = ref<EmployeeModel>({
  id: undefined,
  position: '',
  genderName: '',
  education: '',
  professionalTitle: '',
  startWorkDate: '',
  remark: '',
})

watch(
  () => currentRow.value,
  (val) => {
    form.value = { ...val }
  },
  { immediate: true, deep: true },
)
const needCert = computed(() => {
  return `${form.value.position}` === '1' || `${form.value.position}` === '2'
})
const rules = computed(() => {
  return {
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    position: [{ required: true, message: '请输入职务', trigger: 'blur' }],
    genderName: [{ required: true, message: '请输入性别', trigger: 'blur' }],
    education: [{ required: true, message: '请输入学历', trigger: 'blur' }],
    professionalTitle: [{ required: true, message: '请输入职称', trigger: 'blur' }],
    certLink: [
      {
        validator: (_rule: any, value: any, callback: any) => {
          // 职务 1 或 2 时为必填
          const need = `${form.value.position}` === '1' || `${form.value.position}` === '2'

          if (need && !value) {
            callback(new Error('请输入岗位证书'))
          }
          else {
            callback()
          }
        },
        trigger: 'blur',
      },
    ],

  }
})

function dialogCancel() {
  dialogVisible.value = false
}

function dialogSubmit() {
  formRef.value?.validate((valid) => {
    if (!valid)
      return

    if (subLoading.value)
      return
    subLoading.value = true

    const request = dialogMode.value === 'edit'
      ? PutEmployee(form.value)
      : addEmployee(form.value)
    console.log(form.value, 'form.value')

    request
      .then(() => {
        showMessageSuccess(dialogMode.value === 'edit' ? '修改成功' : '新增成功')
        dialogVisible.value = false
        getList()
      })
      .finally(() => {
        subLoading.value = false
      })
  })
}

onMounted(() => {
  getPositionList()
})
</script>

<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-form ref="queryEl" :inline="true" :model="queryParams" @submit.prevent>
      <el-form-item>
        <el-input
          v-model="queryParams.position"
          placeholder="请输入职位查询"
          clearable
          style="width: 200px"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="getList">
          查询
        </el-button>
        <el-button type="primary" plain :icon="Refresh" @click="retQuery">
          重置
        </el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="success" plain :icon="Plus" @click="handleAdd">
          新增
        </el-button>
        <el-button type="danger" plain :icon="Delete" :disabled="multiple" @click="handleDelete">
          删除
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
      <el-table-column prop="id" label="编号" align="center" width="80" />
      <el-table-column prop="position" label="职务" align="center" />
      <el-table-column prop="genderName" label="性别" align="center" />
      <el-table-column prop="education" label="学历" align="center" />
      <el-table-column prop="professionalTitle" label="职称" align="center" />
      <el-table-column prop="startWorkDate" label="开始工作时间" align="center" />

      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handleEdit(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="clientPage.total > 0"
      v-model:page-num="queryParams.page.current"
      v-model:page-size="queryParams.page.size"
      :total="clientPage.total"
      @pagination="getList"
    />

    <!-- 弹窗部分 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'edit' ? '编辑员工' : '新增员工'"
      width="800"
      :close-on-click-modal="false"
      @close="dialogCancel"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140"
      >
        <el-row :gutter="20">
          <!-- 职务 -->
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <!-- 职务-下拉-请求后端  positionList -->
          <el-col :span="12">
            <el-form-item label="职务" prop="position">
              <el-select v-model="form.position" placeholder="请选择职务" style="width: 100%">
                <el-option v-for="item in positionList" :key="item.code" :label="item.desc" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 性别 -->
          <el-col :span="12">
            <el-form-item label="性别" prop="genderName">
              <el-select v-model="form.genderName" placeholder="请选择性别" style="width: 100%">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 学历 -->
          <el-col :span="12">
            <el-form-item label="学历" prop="education">
              <el-select v-model="form.education" placeholder="请选择学历" style="width: 100%">
                <el-option v-for="item in EDUCATION_LIST" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 职称 -->
          <el-col :span="12">
            <el-form-item label="职称" prop="professionalTitle">
              <el-select v-model="form.professionalTitle" placeholder="请选择职称" style="width: 100%">
                <el-option v-for="item in PROFESSIONAL_TITLE_LIST" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 出生日期 -->
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker v-model="form.birthday" type="date" style="width: 100%" placeholder="请选择出生日期" />
            </el-form-item>
          </el-col>

          <!-- 开始工作时间 -->
          <el-col :span="12">
            <el-form-item label="开始工作时间" prop="startWorkDate">
              <el-date-picker v-model="form.startWorkDate" type="date" style="width: 100%" placeholder="请选择开始工作时间" />
            </el-form-item>
          </el-col>

          <!-- 项目经理 B证 -->
          <el-col :span="12">
            <el-form-item label="B 证（项目经理）" prop="projectSafeCert">
              <el-input v-model="form.projectSafeCert" placeholder="请输入证书编号或链接" />
            </el-form-item>
          </el-col>

          <!-- 安全员 C证 -->
          <el-col :span="12">
            <el-form-item label="C 证（安全员）" prop="safeCert">
              <el-input v-model="form.safeCert" placeholder="请输入证书编号或链接" />
            </el-form-item>
          </el-col>

          <!-- 岗位证书 -->
          <el-col :span="12">
            <el-form-item label="岗位证书" prop="certLink" :class="{ 'is-required': needCert }">
              <el-input v-model="form.certLink" placeholder="施工员/安全员/资料员..." />
            </el-form-item>
          </el-col>

          <!-- 通用证书链接 -->
          <el-col :span="12">
            <el-form-item label="证书链接" prop="certificate">
              <el-input v-model="form.certificate" placeholder="证书附件链接" />
            </el-form-item>
          </el-col>

          <!-- 模板链接 -->
          <el-col :span="12">
            <el-form-item label="模板链接" prop="templateLink">
              <el-input v-model="form.templateLink" placeholder="模板文件链接" />
            </el-form-item>
          </el-col>

          <!-- 备注 -->
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogCancel">
            取消
          </el-button>
          <el-button type="primary" :loading="subLoading" @click="dialogSubmit">
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>
