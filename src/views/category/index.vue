<script setup lang="ts">
import type { FormRules, UploadFile, UploadFiles } from 'element-plus'
import type { UploadFileResponseModel } from '@/components/UploadFile/types'
import type { VideoProjectModel } from '@/model/videoProject'
import { QuestionFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { addVideoProject, DelVideoProject, getVideoProjectList, PutVideoProject } from '@/api/videoProject'

const router = useRouter()
const { categoryList } = useUserStore()
const currentCategoryId = computed(() => {
  const raw = router.currentRoute.value.params.id
  return Array.isArray(raw) ? String(raw[0] ?? '') : String(raw ?? '')
})

const loading = ref(false)
const videoProjectList = ref<VideoProjectModel[]>([])
const editForm = ref<VideoProjectModel>({})
const editFormRef = useTemplateRef('editFormEl')
const visible = ref(false)
const isAdd = ref(true)
const submitLoading = ref(false)
const ids = ref<number[]>([])
const names = ref<string[]>([])
const route = useRoute()
const categoryId = computed<string>(() => {
  return route.params.id as string
})
const projectListEmpty = computed(() => videoProjectList.value.length === 0)
const rules: FormRules = {
  categoryId: [{ required: true, trigger: 'change', message: '请选择项目分类' }],
  projectName: [{ required: true, trigger: 'blur', message: '请输入项目名称' }],
  coverUrl: [{ required: true, trigger: 'blur', message: '请输入封面图链接' }],
  projectDesc: [{ required: true, trigger: 'blur', message: '请输入项目描述' }],
}

function getList() {
  if (loading.value)
    return
  loading.value = true
  getVideoProjectList({
    page: {
      size: 1000,
      current: 1,
    },
    categoryId: categoryId.value,
  }).then((res) => {
    videoProjectList.value = res.data.records || []
  }).finally(() => {
    loading.value = false
  })
}

function handleAddProject() {
  editForm.value.categoryId = currentCategoryId.value
  visible.value = true
  isAdd.value = true
}
function handleEdit(item: VideoProjectModel) {
  isAdd.value = false
  editForm.value = { ...item }
  visible.value = true
}

function handleCoverUrlSuccess(res: { response: ResponseData<UploadFileResponseModel>, uploadFile: UploadFile, uploadFiles: UploadFiles }) {
  editForm.value.coverUrl = res.response.data.accessPath || ''
}
function cancel() {
  visible.value = false
  editForm.value = {}
}

function handleSubmit() {
  editFormRef.value?.validate((valid) => {
    if (valid) {
      if (submitLoading.value)
        return
      submitLoading.value = true
      const api = isAdd.value ? addVideoProject : PutVideoProject
      api(editForm.value).then(() => {
        visible.value = false
        showMessageSuccess(isAdd.value ? '新增成功' : '编辑成功')
        reset()
        getList()
      }).finally(() => {
        submitLoading.value = false
      })
    }
  })
}

function handleDelete(_ids: number[] | VideoProjectModel) {
  const delIds = Array.isArray(_ids) ? _ids : [_ids.id!]
  if (delIds.length === 0)
    return
  const delNames = Array.isArray(_ids) ? names.value : [_ids.projectName!]
  confirmWarning(`是否确认删除项目名称：${delNames.join(', ')}？`).then(() => {
    delMsgLoading(DelVideoProject(delIds), '正在删除...').then(() => {
      showMessageSuccess('删除成功')
      getList()
    })
  })
}

function reset() {
  editForm.value = {}
  resetForm(editFormRef.value)
  submitLoading.value = false
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="category-page p-[16px] mx-auto  ">
    <div
      v-loading="loading"
      class="
    project-grid
    grid
    gap-[10px]
    auto-rows-[260px]
    min-h-[260px]

  "
      :class="{
        '[grid-template-columns:260px]': projectListEmpty,
        '[grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]': !projectListEmpty,
      }"
      element-loading-text="加载中..."
    >
      <div
        v-if="!loading"
        class="group bg-white rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer border border-slate-100"
        @click="handleAddProject()"
      >
        <div
          class="relative w-full h-full overflow-hidden bg-gradient-to-br from-indigo-50 to-rose-50 flex items-center justify-center"
        >
          <div
            class="flex items-center gap-3"
          >
            <span
              class="inline-flex h-12 w-12 rounded-2xl border-2 border-dashed border-slate-300 items-center justify-center text-slate-500 text-3xl leading-none group-hover:scale-110 transition-transform"
            >
              +
            </span>
            <span
              class="text-slate-800 font-semibold text-lg group-hover:text-indigo-600 transition-colors"
            >
              新增项目
            </span>
          </div>

          <!-- 轻微悬浮光效 -->
          <div
            class="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style="background: radial-gradient(60% 60% at 50% 50%, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%);"
          />
        </div>
      </div>

      <div
        v-for="(item, index) in videoProjectList"
        :key="index"
        class="group bg-white rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer border border-slate-100 flex flex-col"
      >
        <!-- 封面图 -->
        <div class="relative w-full h-[120px] overflow-hidden">
          <img
            :src="item.coverUrl"
            :alt="item.projectName"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          >
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70 group-hover:opacity-60 transition" />
        </div>

        <!-- 内容 -->
        <div class="p-4 flex-1">
          <h3 class="text-lg font-semibold text-slate-800 mb-1 truncate group-hover:text-indigo-600 transition">
            {{ item.projectName }}
          </h3>
          <p class="text-slate-500 text-sm leading-relaxed line-clamp-2 min-h-[40px]">
            {{ item.projectDesc }}
          </p>
        </div>

        <!-- 底部操作按钮 -->
        <div
          class="flex items-center justify-end gap-3 px-4 py-2 border-t border-slate-100 bg-slate-50"
          @click.stop
        >
          <icon-font
            size="18px"
            name="edit"
            color="#64748B"
            @click="handleEdit(item)"
          />
          <icon-font
            size="18px"
            name="delete"
            color="red"
            @click="handleDelete(item)"
          />
        </div>
      </div>
    </div>

    <el-dialog
      v-model="visible"
      :title="isAdd ? '新增项目' : '修改项目'"
      width="500"
      :close-on-click-modal="false"
      @close="cancel"
    >
      <el-form ref="editFormEl" :inline="true" :model="editForm" :rules="rules" class="large-editForm" label-width="100">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="项目分类" prop="categoryId" style="width: 100%">
              <el-select v-model="editForm.categoryId" placeholder="请选择项目分类" disabled>
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="项目名称" prop="projectName" style="width: 100%">
              <el-input v-model="editForm.projectName" placeholder="请输入项目名称" size="large" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="coverUrl" style="width: 100%">
              <template #label>
                <span>
                  <el-tooltip content="可手动输入封面地址，也可以上传文件自动获取" placement="top">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                  封面地址
                </span>
              </template>
              <div class="flex w-full flex-1 justify-between items-center">
                <el-input v-model="editForm.coverUrl" placeholder="请输入封面地址" size="large" style="width: 220px; height: 40px;" />
                <UploadFile :limit="1" mode="button" @on-success="handleCoverUrlSuccess" />
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="项目描述" prop="projectDesc" style="width: 100%">
              <el-input
                v-model="editForm.projectDesc"
                type="textarea"
                placeholder="请输入项目描述"
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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
