<script setup lang="ts">
import type { PatientModel } from '@/model/patient'

const list = ref<PatientModel[]>([
  {
    id: 1,
    name: '张三',
    age: 30,
    gender: 1,
    phone: '12345678901',
    email: 'zhangsan@example.com',
    address: '北京市朝阳区',
    medicalHistory: ['高血压'],
  },
  {
    id: 2,
    name: '李四',
    age: 25,
    gender: 2,
    phone: '19876543210',
    email: 'lisi@example.com',
    address: '上海市浦东新区',
    medicalHistory: ['糖尿病'],
  },
])
</script>

<template>
  <el-table :data="list" style="width: 100%">
    <el-table-column type="selection" width="55" />
    <el-table-column align="center" prop="id" label="ID" show-overflow-tooltip />

    <el-table-column prop="name" label="患者姓名" align="center" show-overflow-tooltip />

    <el-table-column prop="gender" label="性别" align="center">
      <template #default="{ row }">
        <TableGender :gender="row.gender" />
      </template>
    </el-table-column>

    <el-table-column align="center" label="操作" width="240" fixed="right">
      <template #default="{ row }">
        <el-button size="small" type="primary">
          修改-{{ row.id }}
        </el-button>
        <el-button size="small" type="danger">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss">
</style>
