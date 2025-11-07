<script setup lang="ts">
import type { ElForm, FormRules } from 'element-plus'
import type { CategoryModel } from '@/model/category'
import type { ProjectModel } from '@/model/project'
import { CirclePlus, Refresh, Search } from '@element-plus/icons-vue'
import { getCategoryTree } from '@/api/category'
import { addProject, getProjectList, PutProject } from '@/api/project'
import { download } from '@/utils/request/download'

const router = useRouter()
const loading = ref(false)
const queryRef = useTemplateRef('queryEl')
const visible = ref(false)
const isAdd = ref(false)
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const submitLoading = ref(false)
const queryParams = ref<ListPageParamsWrapper<ProjectModel>>({
  page: {
    size: 10,
    current: 1,
  },
})
const form = ref<ProjectModel & {
  times?: string[] | undefined
}>({
  times: ['2025-11-01', '2025-11-07'],
  projectDuration: 180,
  genTimes: __DEV__ ? 0 : 10,
  genIds: 0,
  projectName: __DEV__ ? '智慧园区施工项目' : '',
  typeList: __DEV__ ? ['1'] : [],
  projectDesc: __DEV__ ? '本项目主要包含园区智慧化机电安装、弱电系统布线、消防系统联调等内容。' : '',
  projectAddress: __DEV__ ? '北京市朝阳区智慧产业园一期' : '',
  projectRequire: __DEV__ ? '本工程须严格按照国家施工规范执行，确保安全文明施工，按设计文件要求完成全部施工内容。' : '',
  projectCommit: __DEV__ ? '我单位郑重承诺，严格执行施工计划，保证施工质量、安全文明施工。' : '',
  safeRequire: __DEV__ ? '现场应建立安全责任制度，严格执行安全操作规程，加强安全教育。' : '',
  safeCommit: __DEV__ ? '现场应建立安全责任制度，严格执行安全操作规程，加强安全教育。' : '',
  qualityRequire: '执行国家质量验收标准，确保项目按图施工，工程质量达到优良标准。',
  qualityCommit: '我单位承诺，严格按规范施工，确保工程质量达到优良等级。',
})
const categoryList = ref<CategoryModel[]>([])
function getCategoryListData() {
  getCategoryTree({}).then((res) => {
    categoryList.value = res.data
  })
}
const rules: FormRules = {
  projectName: [{ required: true, trigger: 'change', message: '请输入项目名称' }],
  projectDuration: [{ required: true, trigger: 'change', message: '请输入项目工期' }],
  typeList: [{ required: true, trigger: 'change', message: '请输入项目类别' }],
  genTimes: [{ required: true, trigger: 'change', message: '请输入生成次数' }],
  genIds: [{ required: true, trigger: 'change', message: '请输入生成的ids' }],
  times: [{ required: true, trigger: 'change', message: '请选择计划日期' }],
  projectDesc: [{ required: true, trigger: 'change', message: '请输入工程概况' }],
  projectAddress: [{ required: true, trigger: 'change', message: '请输入项目建设地址' }],
  projectRequire: [{ required: true, trigger: 'change', message: '请输入工期要求' }],
  projectCommit: [{ required: true, trigger: 'change', message: '请输入工期承诺' }],
  safeRequire: [{ required: true, trigger: 'change', message: '请输入安全要求' }],
  safeCommit: [{ required: true, trigger: 'change', message: '请输入安全承诺' }],
  qualityRequire: [{ required: true, trigger: 'change', message: '请输入质量要求' }],
  qualityCommit: [{ required: true, trigger: 'change', message: '请输入质量承诺' }],
}
/** 静态日志数据（示例） */
const list = ref<ProjectModel[]>([])

function getList(): void {
  if (loading.value)
    return
  loading.value = true
  getProjectList(queryParams.value).then((res) => {
    list.value = res.data.records
  }).finally(() => {
    loading.value = false
  })
}

function handleAdd() {
  randomProjectForm()
  visible.value = true
  isAdd.value = true
}

function handlePreview(row: ProjectModel) {
  router.push({
    name: 'TimesBid',
    params: {
      id: row.id,
    },
  })
}

function handleBatchDownload(row: ProjectModel) {
  download.get({
    url: `/api/project/downloadZip`,
    filename: `${row.projectName}-${Date.now()}.zip`,
    config: {
      params: {
        id: row.id,
        type: 0,
      },
    },
  })
  const url = `${__API_URL__}/api/project/downloadZip`
  console.log(url)
}

function retQuery(): void {
  queryParams.value = {
    page: {
      size: 1,
      current: 10,
    },
  }
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
      const api = isAdd.value ? addProject : PutProject
      const data = {
        ...form.value,
        projectStartTime: form.value.times ? form.value.times[0] : undefined,
        projectEndTime: form.value.times ? form.value.times[1] : undefined,
        times: undefined,
        typeList: form.value.typeList?.map((item) => {
          return item[item.length - 1]
        }),
      }
      console.log(data)

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
    projectDuration: 0,
    genTimes: 0,
    genIds: 0,
  }
  resetForm(formRef.value)
  submitLoading.value = false
}

function randomProjectForm() {
  function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  const names = [
    '智慧园区建设工程',
    '智能大厦弱电系统工程',
    '智慧校园改造项目',
    '新能源工厂智能化项目',
    '智慧交通综合管控平台项目',
  ]

  const addresses = [
    '北京市海淀区AI产业园',
    '上海市浦东新区智能制造园区',
    '深圳市南山区科技城',
    '杭州市滨江区数字经济中心',
    '重庆市两江新区智慧产业基地',
  ]

  const descList = [
    '本项目包含智能安防、园区网络、机电安装等内容。',
    '本项目主要包括校园智能安防、智慧课堂与系统集成。',
    '本项目涉及数字工厂改造、能源管控和弱电系统施工。',
    '项目涵盖智慧道路监控、通讯系统、信号控制等建设。',
    '系统包含机电安装、消防系统联调、楼宇自动化等内容。',
  ]

  const commit = [
    '严格执行施工计划，提供优质服务。',
    '确保施工安全、质量达标文明施工。',
    '遵循国家标准，按期完成全部工程内容。',
    '强化项目管理，确保工程顺利交付。',
    '严格执行安全规范，确保工程质量。',
  ]

  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - Math.floor(Math.random() * 30))
  const end = new Date(start)
  end.setDate(start.getDate() + Math.floor(Math.random() * 30) + 5)

  const randomDate = (d: Date) => d.toISOString().slice(0, 10)

  form.value.projectName = pick(names)
  form.value.projectAddress = pick(addresses)
  form.value.projectDesc = pick(descList)
  form.value.projectRequire = pick(descList)
  form.value.projectCommit = pick(commit)
  form.value.safeRequire = pick(commit)
  form.value.safeCommit = pick(commit)
  form.value.qualityRequire = pick(commit)
  form.value.qualityCommit = pick(commit)
  form.value.times = [randomDate(start), randomDate(end)]
  form.value.projectDuration = Math.floor(Math.random() * 240) + 60
  form.value.genTimes = Math.floor(Math.random() * 10) + 1
  form.value.genIds = Math.floor(Math.random() * 10000)
  form.value.typeList = [String(Math.floor(Math.random() * 3) + 1)]
}

onMounted(() => {
  getList()
  // getCategoryListData()
})
</script>

<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-form ref="queryEl" :inline="true" :model="queryParams" @submit.prevent>
      <el-form-item>
        <el-input
          v-model="queryParams.projectName "
          placeholder="请输入项目名称查询"
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
        <el-button type="success" :icon="CirclePlus" @click="handleAdd()">
          新增
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="list"
      row-key="id"
      style="width: 100%"
    >
      <el-table-column prop="id" label="项目编号" align="center" />

      <el-table-column prop="projectName" label="项目名称" align="center" show-overflow-tooltip />

      <el-table-column prop="projectDuration" label="项目工期" align="center" :formatter="$formatterTableWithSuffix('天')" />

      <el-table-column prop="genTimes" label="生词次数" align="center" />

      <el-table-column prop="genIds" label="生成的次数" align="center" :formatter="$formatterTableEmpty" min-width="100" />

      <el-table-column prop="genIds" label="计划日期" align="center" show-overflow-tooltip>
        <template #default="{ row }">
          {{ `${row.projectStartTime} 至 ${row.projectEndTime}` }}
        </template>
      </el-table-column>

      <el-table-column prop="projectDesc" label="工程概况" align="center" show-overflow-tooltip />

      <el-table-column prop="projectAddress" label="项目建设地址" align="center" show-overflow-tooltip min-width="120" />

      <el-table-column prop="projectRequire" label="工期要求" align="center" show-overflow-tooltip />

      <el-table-column prop="projectCommit" label="工期承诺" align="center" show-overflow-tooltip />

      <el-table-column prop="safeRequire" label="安全要求" align="center" show-overflow-tooltip />

      <el-table-column prop="safeCommit" label="安全承诺" align="center" show-overflow-tooltip />

      <el-table-column prop="qualityRequire" label="质量要求" align="center" show-overflow-tooltip />

      <el-table-column prop="qualityCommit" label="质量承诺" align="center" show-overflow-tooltip />

      <el-table-column label="创建人" align="center" prop="createdUserName" width="120" show-overflow-tooltip>
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
          <el-button type="success" size="small" @click="handlePreview(row)">
            查看
          </el-button>
          <el-button type="warning" size="small" @click="handleBatchDownload(row)">
            批量下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="visible"
      :title="isAdd ? '新增项目' : '修改项目'"
      width="800"
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form ref="formRef" :inline="true" :model="form" :rules="rules" class="large-form" label-width="120">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName" style="width: 100%">
              <el-input v-model="form.projectName" placeholder="请输入项目名称" size="large" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="项目工期(天)" prop="projectDuration" style="width: 100%">
              <el-input-number
                v-model="form.projectDuration"
                :min="0"
                style="width: 100%;"
                controls-position="right"
                size="large"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="项目类别" prop="typeList" style="width: 100%">
              <el-cascader
                v-model="form.typeList"
                :props="{
                  label: 'name',
                  value: 'id',
                  checkStrictly: true,
                  multiple: true,
                }"
                :options="categoryList"
                size="large"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="生成次数" prop="genTimes" style="width: 100%">
              <el-input-number
                v-model="form.genTimes"
                :min="0"
                style="width: 100%;"
                controls-position="right"
                size="large"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="生成的ids" prop="genIds" style="width: 100%">
              <el-input-number
                v-model="form.genIds"
                :min="0"
                style="width: 100%;"
                controls-position="right"
                size="large"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="计划日期" prop="times" style="width: 100%">
              <el-date-picker
                v-model="form.times"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                size="large"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="工程概况" prop="projectDesc" style="width: 100%">
              <el-input
                v-model="form.projectDesc"
                :rows="2"
                type="textarea"
                placeholder="请输入工程概况"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="项目建设地址" prop="projectAddress" style="width: 100%">
              <el-input
                v-model="form.projectAddress"
                :rows="2"
                type="textarea"
                placeholder="请输入项目建设地址"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="工期要求" prop="projectRequire" style="width: 100%">
              <el-input
                v-model="form.projectRequire"
                :rows="2"
                type="textarea"
                placeholder="请输入工期要求"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="工期承诺" prop="projectCommit" style="width: 100%">
              <el-input
                v-model="form.projectCommit"
                :rows="2"
                type="textarea"
                placeholder="请输入工期承诺"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="安全要求" prop="safeRequire" style="width: 100%">
              <el-input
                v-model="form.safeRequire"
                :rows="2"
                type="textarea"
                placeholder="请输入安全要求"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="安全承诺" prop="safeCommit" style="width: 100%">
              <el-input
                v-model="form.safeCommit"
                :rows="2"
                type="textarea"
                placeholder="请输入安全承诺"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="质量要求" prop="qualityRequire" style="width: 100%">
              <el-input
                v-model="form.qualityRequire"
                :rows="2"
                type="textarea"
                placeholder="请输入质量要求"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="质量承诺" prop="qualityCommit" style="width: 100%">
              <el-input
                v-model="form.qualityCommit"
                :rows="2"
                type="textarea"
                placeholder="请输入安质量承诺"
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
