<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    console.log('Tab 切换到前台')
  }
  else {
    console.log('Tab 切到后台/隐藏')
  }
})
window.addEventListener('beforeunload', () => {
  console.log('Tab 即将关闭或刷新')
})

window.addEventListener('pagehide', () => {
  console.log('Tab 被卸载（关闭/刷新/跳转）')
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>

<style scoped>

</style>
