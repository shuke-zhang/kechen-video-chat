<!-- src/components/DocsLayout.vue -->
<script setup lang="ts">
import type { MenuItemRegistered } from 'element-plus'
import AppMain from './AppMain.vue'
import Head from './components/head/index.vue'
import Sidebar from './components/sidebar/index.vue'
// 获取当前路由对象
const route = useRoute()
/**
 * 当前点击的是公共还是私有侧边栏菜单
 */
const currentSidebarItem = ref<MenuItemRegistered | null>(null)
// 计算属性：判断当前页面是否显示左侧菜单
const showSidebar = computed(() => {
  // meta 可能不存在，所以要加安全判断
  return route.meta?.showLeftMenu === true
})

function onMenuItemClick(item: MenuItemRegistered) {
  currentSidebarItem.value = item
}
onMounted(() => {

})
</script>

<template>
  <div>
    <!-- 固定头部 -->
    <Head />

    <Sidebar v-if="showSidebar" @menu-item-click="onMenuItemClick" />

    <div class="app-wrapper" :class="{ 'no-sidebar': !showSidebar }">
      <AppMain :current-sidebar-item="currentSidebarItem" />
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
