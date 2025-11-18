<script setup lang="ts">
import type { FormRules } from 'element-plus'
import type { CompanyModel } from '@/model/company'
import { onMounted, ref } from 'vue'
import {
  addCompany,
  getCompanySelectOne,
  PutCompany,
} from '@/api/company'

const formRef = useTemplateRef('formRef')
const loading = ref(false)
const submitLoading = ref(false)
const isEdit = ref(false)
const form = ref<CompanyModel>({
  id: undefined,
  name: '',
  employeesTotal: 0,
  juniorCount: 0,
  middleCount: 0,
  seniorCount: 0,
  technicianCount: 0,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  employeesTotal: [{ required: true, message: '请输入员工总人数', trigger: 'blur' }],
  juniorCount: [{ required: true, message: '请输入初级职称人数', trigger: 'blur' }],
  middleCount: [{ required: true, message: '请输入中级职称人数', trigger: 'blur' }],
  seniorCount: [{ required: true, message: '请输入高级职称人数', trigger: 'blur' }],
  technicianCount: [{ required: true, message: '请输入技工人数', trigger: 'blur' }],
}

/**
 * 查询公司信息
 */
function getCompanyOne() {
  if (loading.value)
    return
  loading.value = true
  return getCompanySelectOne().then((res) => {
    if (res.data) {
      form.value = res.data
      isEdit.value = true
    }
    else {
      isEdit.value = false
    }
  }).finally(() => {
    loading.value = false
  })
}

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (submitLoading.value)
        return

      submitLoading.value = true

      // 判断是新增还是修改
      const request = isEdit.value
        ? PutCompany(form.value)
        : addCompany(form.value)

      request
        .then(() => {
          showMessageSuccess(`${isEdit.value ? '修改成功' : '新增成功'}`)
          getCompanyOne()
        })
        .finally(() => {
          submitLoading.value = false
        })
    }
  })
}

onMounted(() => {
  getCompanyOne()
})
</script>

<template>
  <div class="app-container">
    <el-card class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-medium">
            {{ isEdit ? '公司信息' : '公司信息' }}
          </span>
        </div>
      </template>

      <!-- 表单 -->
      <el-form
        ref="formRef"
        v-loading="loading"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="max-w-[600px]"
      >
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="form.name" :disabled="isEdit" placeholder="请输入公司名称" size="large" />
        </el-form-item>

        <el-form-item label="员工总人数" prop="employeesTotal">
          <el-input-number
            v-model="form.employeesTotal"
            :min="0"
            :step="1"
            size="large"
          />
        </el-form-item>

        <el-form-item label="初级职称人数" prop="juniorCount">
          <el-input-number
            v-model="form.juniorCount"
            :min="0"
            :step="1"
            size="large"
          />
        </el-form-item>

        <el-form-item label="中级职称人数" prop="middleCount">
          <el-input-number
            v-model="form.middleCount"
            :min="0"
            :step="1"
            size="large"
          />
        </el-form-item>

        <el-form-item label="高级职称人数" prop="seniorCount">
          <el-input-number
            v-model="form.seniorCount"
            :min="0"
            :step="1"
            size="large"
          />
        </el-form-item>

        <el-form-item label="技工人数" prop="technicianCount">
          <el-input-number
            v-model="form.technicianCount"
            :min="0"
            :step="1"
            size="large"
          />
        </el-form-item>
      </el-form>

      <div class="dialog-footer">
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          {{ isEdit ? '保存修改' : '新增信息' }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>

</style>
