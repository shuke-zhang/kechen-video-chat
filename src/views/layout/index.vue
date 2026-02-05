<!-- src/components/DocsLayout.vue -->
<script setup lang="ts">
import AppMain from './AppMain.vue'
import Head from './components/head/index.vue'
import Sidebar from './components/sidebar/index.vue'

const sidebarStore = useSidebarStore()

const isShowSidebar = computed(() => sidebarStore.isShowSidebar)
</script>

<template>
  <div>
    <!-- 固定头部 -->
    <Head />

    <Sidebar v-if="isShowSidebar" />

    <div
      class="app-wrapper" :class="{ 'no-sidebar': !isShowSidebar }"
    >
      <AppMain />
    </div>

    <!-- 中间内容区：可伸展 -->
  </div>
</template>

<style scoped lang="scss">
.app-wrapper {
  position: absolute;
  top: vars.$header-height;
  left: vars.$sidebar-menu-width;
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
