<script setup lang="ts">
import type { ElForm } from 'element-plus'
import type { DictDataCssModel } from '@/model/dict'
import type { PatientModel } from '@/model/patient'
import { addPatient, PutPatient } from '@/api/patient'

const props = defineProps({
  isAdd: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Object,
  },
  sysUserSex: {
    type: Array as PropType<DictDataCssModel[]>,
    default: () => [],
  },
  sysEducation: {
    type: Array as PropType<DictDataCssModel[]>,
    default: () => [],
  },
})
const emit = defineEmits(['success'])

const visible = defineModel({ type: Boolean, required: false })
const submitLoading = ref(false)
const form = ref<PatientModel>({

  // name: '王大',
  // sex: '1',
  // phone: '15012342630',
  // idCard: '532122200002072231',
  // birthday: '2000-02-07',
  // education: '4',
  // address: '云南省xx市xx县xx街道xx小区xx号',

})
const formRef = ref<InstanceType<typeof ElForm> | null>(null)

const rules = {
  name: [{ required: true, trigger: 'blur', message: '请输入患者名称' }],
  sex: [{ required: true, trigger: 'blur', message: '请输入患者性别' }],
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (!value) {
          return
        }
        if (!validatePhoneReg.test(value)) {
          return callback('请输入正确的11位手机号码')
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
  idCard: [
    { required: true, message: '身份证号码不能为空', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (!value) {
          return
        }
        if (!validateIdCardReg.test(value)) {
          return callback('请输入正确的身份证号')
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
  birthday: [{ required: true, trigger: 'blur', message: '请输入患者生日' }],
  education: [{ required: true, trigger: 'blur', message: '请选择患者学历' }],
  address: [{ required: true, trigger: 'blur', message: '请输入患者家庭地址' }],
}

function cancel() {
  visible.value = false
  reset()
}

function reset() {
  form.value = {
    name: '',
  }
  resetForm(formRef.value)
  submitLoading.value = false
}

function submit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (submitLoading.value)
        return
      submitLoading.value = true
      const api = props.isAdd ? addPatient : PutPatient
      const data = { ...form.value }
      api(data).then(() => {
        showMessageSuccess('操作成功')
        visible.value = false
        reset()
        emit('success')
      }).finally(() => {
        submitLoading.value = false
      })
    }
  })
}
watch(() => props.data, (newVal) => {
  if (newVal) {
    form.value = {
      ...newVal,
      education: String(newVal.education),
    }
    console.log(form.value, 'form.value')
  }
})
</script>

<template>
  <el-dialog v-model="visible" :title="isAdd ? '新增患者' : '修改患者'" width="800" :close-on-click-modal="false" @close="cancel">
    <el-form ref="formRef" :inline="true" :rules="rules" :model="form" class="large-form" label-width="100">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="患者名称" prop="name" style="width: 100%">
            <el-input v-model="form.name" clearable placeholder="请输入患者名称" size="large" style="width: 100%" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="性别" prop="sex" style="width: 100%">
            <el-select v-model="form.sex" placeholder="请选择性别" size="large" style="width: 100%">
              <el-option v-for="it in sysUserSex" :key="it.value" :label="it.label" :value="it.value" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手机号" prop="phone" style="width: 100%">
            <el-input v-model="form.phone" placeholder="请输入手机号" :maxlength="11" clearable size="large" style="width: 100%" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="身份证号" prop="idCard" style="width: 100%">
            <el-input v-model="form.idCard" placeholder="请输入身份证件号" :maxlength="18" clearable size="large" style="width: 100%" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="生日" prop="birthday" style="width: 100%">
            <el-date-picker
              v-model="form.birthday"
              type="date"
              placeholder="请选择生日"
              value-format="YYYY-MM-DD"
              size="large"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="学历" prop="education" style="width: 100%">
            <el-select v-model="form.education" placeholder="请选择学历" size="large" style="width: 100%">
              <el-option v-for="it in sysEducation" :key="it.value" :label="it.label" :value="it.value" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="家庭住址" prop="address" style="width: 100%">
            <el-input v-model="form.address" placeholder="请输入联系地址" clearable size="large" style="width: 100%" />
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
