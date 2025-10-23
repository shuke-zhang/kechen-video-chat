<!-- userDialog.vue -->
<script setup lang="ts">
import type { ElForm, FormRules } from 'element-plus'
import type { DictDataCssModel } from '@/model/dict'
import type { VideoModel } from '@/model/video'
import type { VideoCategoryModel } from '@/model/videoCategory'
import type { VideoPlanModel } from '@/model/videoPlan'

import { QuestionFilled } from '@element-plus/icons-vue'
import { getVideoList } from '@/api/video'
import { getVideoCategoryTree } from '@/api/videoCategory'
import { addVideoPlan, putVideoPlan } from '@/api/videoPlan'

const props = defineProps({
  isAdd: { type: Boolean, required: true },
  data: { type: Object as PropType<VideoPlanModel>, default: () => ({}) },
  sysUserSex: {
    type: Array as PropType<DictDataCssModel[]>,
    default: () => ([]),
  },
})

const emit = defineEmits(['success'])

const treeProps = {
  label: 'name',
  value: 'id',
  children: 'children',
  isLeaf: 'isLeaf',
}

const visible = defineModel({ type: Boolean, required: false })

const submitLoading = ref(false)
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const videoSelect = ref<VideoModel[]>([])
const form = ref<VideoPlanModel>({
  orderNum: 0,
})

const treeData = ref<VideoCategoryModel[]>([])
const treeLoading = ref(false)
const treeFetched = ref(false)
const videoSelectLoading = ref(false)
const rules: FormRules = {
  name: [{ required: true, trigger: 'blur', message: '请输入方案名称' }],
  planType: [{ required: true, trigger: 'blur', message: '请输入视频类别' }],
  departHis: [{ required: true, trigger: 'blur', message: '请输入科室编号' }],

}

const filterVideoSelect = computed(() => {
  if (!form.value.planType)
    return videoSelect.value
  return videoSelect.value.filter(item => item.videoType === form.value.planType)
})

function cancel(): void {
  visible.value = false
  reset()
}

function reset(): void {
  form.value = {
    orderNum: 0,
  }
  resetForm(formRef.value)
  submitLoading.value = false
}

function submit(): void {
  formRef.value?.validate((valid) => {
    if (!valid)
      return
    if (submitLoading.value)
      return
    submitLoading.value = true
    const api = props.isAdd ? addVideoPlan : putVideoPlan
    const data: VideoPlanModel = {
      ...form.value,
      videoName: videoSelect.value.find(item => item.id === form.value.videoId)?.name,
    }
    api(data).then(() => {
      showLoadingMessageSuccess('操作成功')
      visible.value = false
      reset()
      emit('success')
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

async function ensureTreeData(): Promise<void> {
  if (treeFetched.value || treeLoading.value) {
    return
  }

  treeLoading.value = true
  getVideoCategoryTree()
    .then((res: any) => {
      treeData.value = res?.data ?? []
      treeFetched.value = true
    })
    .catch((e: unknown) => {
      console.error('❌ 加载计划类型失败', e)
      treeData.value = []
    })
    .finally(() => {
      treeLoading.value = false
    })
}

/**
 * 视频分类选择变化
 */
function onVideoCategoryChange() {
  // 清空已选择视频
  if (form.value.videoId) {
    if (!filterVideoSelect.value.map(item => item.id).includes(Number(form.value.videoId))) {
      form.value.videoId = undefined
    }
  }
}

function getVideoSelect() {
  if (videoSelectLoading.value)
    return
  videoSelectLoading.value = true
  getVideoList({
    page: {
      current: 1,
      size: 20,
    },
  }).then((res) => {
    videoSelect.value = res.data.records
    console.log('videoSelect', videoSelect.value)
  }).finally(() => {
    videoSelectLoading.value = false
  })
}

function onVideoChange(value: number | string): void {
  const selected = videoSelect.value.find(item => item.id === value)
  if (selected && selected.videoType) {
    form.value.planType = selected.videoType
  }
}
watch(
  () => props.data,
  (newVal) => {
    if (!newVal.id)
      return
    form.value = {
      ...newVal,
    }
    // 编辑场景：可选把密码校验去掉，或在 UI 隐藏密码项
  },
  { immediate: true },
)
watch(() => visible.value, () => {
  // 重置
  if (visible.value) {
    ensureTreeData()
    getVideoSelect()
  }
})
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="isAdd ? '新增视频方案' : '修改视频方案'"
    width="820"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form ref="formRef" :inline="true" :model="form" :rules="rules" class="large-form" label-width="100">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="方案名称" prop="name" style="width: 100%">
            <el-input v-model="form.name" clearable placeholder="请输入方案名称" size="large" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="planType" style="width: 100%" size="large">
            <template #label>
              <span class="flex items-center">
                <el-tooltip content="选择视频类别后会自动筛选视频" placement="top">
                  <el-icon class="mr-[2px]">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>视频类别
              </span>
            </template>
            <el-tree-select
              v-model="form.planType"
              :data="treeData"
              :props="treeProps"
              style="width: 240px"
              @visible-change="ensureTreeData"
              @change="onVideoCategoryChange"
            >
              <template #empty>
                <div class="p-2 text-[#909399]">
                  {{ treeLoading ? '正在加载…' : '暂无数据' }}
                </div>
              </template>
            </el-tree-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="videoId" style="width: 100%" size="large">
            <template #label>
              <span class="flex items-center">
                <el-tooltip content="选择视频后会自动根据视频添加视频类别" placement="top">
                  <el-icon class="mr-[2px]">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>视频
              </span>
            </template>
            <el-select
              v-model="form.videoId"
              style="width: 100%"
              :props="{
                label: 'name',
                value: 'id',
              }"
              @change="onVideoChange"
            >
              <el-option
                v-for="item in filterVideoSelect"
                :key="item.id"
                :label="item.name"
                :value="item.id!"
              />
              <template #empty>
                <div class="p-2 text-[#909399]">
                  {{ treeLoading ? '正在加载…' : '暂无数据' }}
                </div>
              </template>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum" style="width: 100%" size="large">
            <el-input-number v-model="form.orderNum" controls-position="right" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">
          取 消
        </el-button>
        <el-button type="primary" :loading="submitLoading" @click="submit">
          提 交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
</style>
