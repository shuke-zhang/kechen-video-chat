<!-- UserPage.vue -->
<script setup lang="ts">
import type { ElForm } from 'element-plus'
import type { UserModel } from '@/model/user'
import { CircleClose, CirclePlus, Refresh, Search } from '@element-plus/icons-vue'
import { DelUser, getUserList, putUserPassword } from '@/api/user'
import UserDialog from './userDialog.vue'

const { sys_user_sex } = useDict('sys_user_sex')

const total = ref(0)
const list = ref<UserModel[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const isAdd = ref(false)
const dialogData = ref<UserModel>({})
const ids = ref<number[]>([])
const names = ref<string[]>([])
const single = ref(true)
const multiple = ref(true)

const queryRef = useTemplateRef('queryEl')
const queryParams = ref<ListPageParamsWrapper<UserModel>>({
  page: {
    current: 1,
    size: 10,
  },
})

function getList(): void {
  if (loading.value)
    return
  loading.value = true
  console.log('获取用户列表', queryParams.value)
  getUserList(queryParams.value).then((res) => {
    list.value = res.data.records
    total.value = res.data.total
  }).finally(() => {
    loading.value = false
  })
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

function handlePut(row: UserModel): void {
  isAdd.value = false
  dialogData.value = { ...row }
  dialogVisible.value = true
}

/**
 * 修改密码
 */
function handleUpdatePassWord(row: UserModel) {
  ElMessageBox.prompt(`请输入"${row.name}"的新密码`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    inputErrorMessage: '用户密码长度至少 6 位',
  })
    .then(({ value }) => {
      return putUserPassword({
        id: row.id!,
        password: value,
      })
    })
    .then(() => {
      showLoadingMessageSuccess('操作成功')
    })
}

function handleDel(_ids: number[] | UserModel): void {
  const delIds = Array.isArray(_ids) ? _ids : [_ids.id!]
  const delNames = Array.isArray(_ids) ? names.value : [_ids.name!]
  confirmWarning(`是否确认删除用户：${delNames.join(', ')}？`).then(() => {
    console.log('删除 IDs:', delIds)
    delMsgLoading(DelUser(delIds), '删除中...').then(() => {
      loading.value = false
      ids.value = []
      names.value = []
      single.value = true
      multiple.value = true
      getList()
    })
  })
}

function handleSelectionChange(selection: UserModel[]): void {
  ids.value = selection.map(i => i.id!)
  names.value = selection.map(i => i.name!)
  single.value = selection.length !== 1
  multiple.value = selection.length === 0
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="container">
    <!-- 查询 -->
    <el-form ref="queryEl" :inline="true" :model="queryParams" @submit.prevent>
      <el-form-item>
        <el-input
          v-model="queryParams.name"
          placeholder="请输入用户名查询"
          clearable
          style="width: 220px"
          @keyup.enter="getList"
        />
      </el-form-item>

      <el-form-item>
        <el-input
          v-model="queryParams.departName"
          placeholder="请输入所属科室名称查询"
          clearable
          style="width: 220px"
          @keyup.enter="getList"
        />
      </el-form-item>

      <el-form-item>
        <el-input
          v-model="queryParams.departHis"
          placeholder="请输入科室编号查询"
          clearable
          style="width: 220px"
          @keyup.enter="getList"
        />
      </el-form-item>

      <!-- <el-form-item>
        <el-select v-model="queryParams.sexDesc" placeholder="性别" clearable size="large" style="width: 160px">
          <el-option v-for="it in sys_user_sex" :key="it.value" :label="it.label" :value="it.label" />
        </el-select>
      </el-form-item> -->

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

      <el-table-column prop="id" label="用户编号" align="center" width="90" />

      <el-table-column prop="name" label="用户名" align="center" width="140" show-overflow-tooltip />

      <el-table-column prop="departName" label="所属科室" align="center" width="140" />

      <el-table-column prop="departHis" label="科室编号" align="center" width="140" />

      <el-table-column prop="createdTime" label="创建时间" align="center" width="220" />

      <el-table-column align="center" label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handlePut(row)">
            修改
          </el-button>
          <el-button size="small" type="warning" @click="handleUpdatePassWord(row)">
            修改密码
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
      :data="dialogData"
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
