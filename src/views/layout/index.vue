<!-- src/components/DocsLayout.vue -->
<script setup lang="ts">
import type { MenuItemRegistered } from 'element-plus'
import AppMain from './AppMain.vue'
import Head from './components/head/index.vue'

/**
 * 当前点击的是公共还是私有侧边栏菜单
 */
const currentSidebarItem = ref<MenuItemRegistered | null>(null)
const sidebarStore = useSidebarStore()
const isShowSidebar = computed(() => sidebarStore.isShowSidebar)

onMounted(() => {

})
</script>

<template>
  <div>
    <!-- 固定头部 -->
    <Head />

    <div
      class="app-wrapper" :class="{ 'no-sidebar': !isShowSidebar }"
    >
      <AppMain :current-sidebar-item="currentSidebarItem" />
    </div>

    <!-- 中间内容区：可伸展 -->
  </div>
</template>

<style scoped lang="scss">
.app-wrapper {
  position: absolute;
  top: vars.$header-height;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  overflow-y: auto;
  box-sizing: border-box;
  &.no-sidebar {
    left: 0;
  }
}
</style>
