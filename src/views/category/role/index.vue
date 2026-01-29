<!-- UserPage.vue -->
<script setup lang="ts">
import type { ElForm } from 'element-plus'
import type { CharacterModel } from '@/model/character'
import type { VoiceModel } from '@/model/voice'
import { CircleClose, CirclePlus, Refresh, Search } from '@element-plus/icons-vue'
import { delCharacter, getCharacterList } from '@/api/character'
import { getVoiceList } from '@/api/voice'
import RoleDialog from './roleDialog.vue'

const category = useCategoryStore()

const total = ref(0)
const list = ref<CharacterModel[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const isAdd = ref(false)
const dialogData = ref<CharacterModel>({})
const ids = ref<number[]>([])
const names = ref<string[]>([])
const single = ref(true)
const multiple = ref(true)
const voiceLoading = ref(false)
const voiceList = ref<VoiceModel[]>([])

const queryRef = useTemplateRef('queryEl')
const queryParams = ref<ListPageParamsWrapper<CharacterModel>>({
  page: {
    current: 1,
    size: 10,
  },
  projectId: category.currentProject?.id,
})
const srcList = computed(() => list.value.map(it => it.posterUrl || ''))
function getList(): void {
  if (loading.value)
    return
  loading.value = true
  getCharacterList(queryParams.value).then((res) => {
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
    projectId: category.currentProject?.id,

  }
  resetForm(queryRef.value)
  getList()
}

function handleAdd(): void {
  isAdd.value = true
  dialogData.value = {}
  dialogVisible.value = true
}

function handlePut(row: CharacterModel): void {
  isAdd.value = false
  dialogData.value = { ...row }
  dialogVisible.value = true
}

function handleDel(_ids: number[] | CharacterModel): void {
  const delIds = Array.isArray(_ids) ? _ids : [_ids.id!]
  const delNames = Array.isArray(_ids) ? names.value : [_ids.characterName!]
  confirmWarning(`是否确认删除角色：${delNames.join(', ')}？`).then(() => {
    console.log('删除 IDs:', delIds)
    delMsgLoading(delCharacter(delIds), '删除中...').then(() => {
      loading.value = false
      ids.value = []
      names.value = []
      single.value = true
      multiple.value = true
      getList()
    })
  })
}

function handleSelectionChange(selection: CharacterModel[]): void {
  ids.value = selection.map(i => i.id!)
  names.value = selection.map(i => i.voiceName!)
  single.value = selection.length !== 1
  multiple.value = selection.length === 0
}

/**
 * 远程搜索系统音色
 */
function voiceMethod() {
  if (voiceLoading.value)
    return
  voiceLoading.value = true
  getVoiceList({
    page: {
      current: 1,
      size: 10000,
    },
    projectId: category.currentProject?.id,
  })
    .then((res) => {
      voiceList.value = res.data.records
    })
    .finally(() => {
      voiceLoading.value = false
    })
}

onMounted(() => {
  getList()
  voiceMethod()
})
</script>

<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-form ref="queryEl" :inline="true" :model="queryParams" @submit.prevent>
      <el-form-item>
        <el-input
          v-model="queryParams.voiceName"
          placeholder="请输入角色名查询"
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

      <el-table-column prop="id" label="角色编号" align="center" width="90" />

      <el-table-column prop="characterName" label="角色名称" align="center" width="140" show-overflow-tooltip />

      <el-table-column prop="projectId" label="角色图片" align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <el-image
            style="width: 40px; height: 40px"
            :initial-index="srcList?.findIndex((el) => el === row.posterUrl)"
            :src="row.posterUrl"
            fit="cover"
            :preview-src-list="srcList"
            :zoom-rate="1.2"
            :max-scale="7"
            preview-teleported
            show-progress
            append-to-body
          />
        </template>
      </el-table-column>

      <el-table-column prop="description" label="角色描述" align="center" show-overflow-tooltip />

      <el-table-column prop="voiceName" label="音色" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />

      <el-table-column align="center" label="操作" width="220" fixed="right">
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
    <RoleDialog
      v-model="dialogVisible"
      :is-add="isAdd"
      :data="dialogData"
      :voice-list="voiceList"
      @success="getList"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
