<script setup lang="ts">
defineProps({
  gender: {
    type: Number as PropType<Gender>,
    default: 0,
  },
})
</script>

<template>
  <el-tag :type="gender === 1 ? 'primary' : gender === 2 ? 'danger' : 'info'">
    {{ gender === 1 ? '男生' : gender === 2 ? '女生' : '未知' }}
  </el-tag>
</template>

<style scoped lang="scss">
</style>
