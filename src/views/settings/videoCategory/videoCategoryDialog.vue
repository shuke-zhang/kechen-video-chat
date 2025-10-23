<!-- videoCategoryDialog.vue -->
<script setup lang="ts">
import type { ElForm, FormRules } from 'element-plus'
import type { PropType } from 'vue'
import type { DictDataCssModel } from '@/model/dict'
import type { VideoCategoryModel } from '@/model/videoCategory'
import { addVideoCategory } from '@/api/videoCategory'

const props = defineProps({
  isAdd: { type: Boolean, required: true },
  data: { type: Object as PropType<VideoCategoryModel>, default: () => ({}) },
  allCategories: { type: Array as () => VideoCategoryModel[], default: () => [] },
  videoCategoryTree: { type: Array as PropType<VideoCategoryModel[] | null>, default: () => [] },
  visitList: { type: Array as PropType<DictDataCssModel[]>, default: () => [] },
})
const emit = defineEmits(['success'])

const visible = defineModel({ type: Boolean, required: false })

const submitLoading = ref(false)
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const form = ref<VideoCategoryModel>({
  name: '',
  parentId: undefined,
})

const rules: FormRules = {
  parentId: [{ required: true, trigger: 'change', message: '请选择父级类别' }],
  name: [{ required: true, trigger: 'blur', message: '请输入类别名称' }],
}

function cancel(): void {
  visible.value = false
  reset()
}

function reset(): void {
  form.value = { name: '', parentId: undefined }
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
    const data: VideoCategoryModel = {
      ...form.value,
      treatProjectName: props.visitList?.find(el => el.value === form.value.treatProjectId)?.label,
    }
    addVideoCategory(data).then(() => {
      visible.value = false
      reset()
      emit('success')
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

watch(() => visible.value, (newVal) => {
  if (newVal) {
    if (props.videoCategoryTree) {
      form.value.parentId = props.videoCategoryTree.length > 0 && props.isAdd ? props.videoCategoryTree[0].id : undefined
    }
    const v = props.data
    if (!props.isAdd) {
      form.value = {
        id: v.id,
        name: v.name,
        parentId: v.parentId,
        treatProjectName: v.treatProjectName,
        treatProjectId: v.treatProjectId,
      }
    }
  }
}, { immediate: true })
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="isAdd ? '新增视频类别' : '修改视频类别'"
    width="800"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form ref="formRef" :inline="true" :model="form" :rules="rules" class="large-form" label-width="100">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="父级类别" prop="parentId" style="width: 100%">
            <el-tree-select
              v-model="form.parentId"
              check-strictly
              placeholder="请选择父级分类"
              :data="videoCategoryTree"
              :render-after-expand="false"
              :props="{
                label: 'name',
                value: 'id',
                children: 'children',
              }"
              style="width: 240px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类别名称" prop="name" style="width: 100%">
            <el-input v-model="form.name" clearable placeholder="例如：冥想 / 培训 / 宣传" size="large" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="诊疗项" prop="treatProjectId" style="width: 100%">
            <el-select v-model="form.treatProjectId" placeholder="请选择诊疗项" style="width: 240px">
              <el-option
                v-for="item in visitList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 诊疗项目 一样去选择 -->
        <!-- 诊疗id传递的时候需要传递 -->
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
