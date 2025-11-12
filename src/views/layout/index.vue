<!-- src/components/DocsLayout.vue -->
<script setup lang="ts">
import type { MenuItemRegistered } from 'element-plus'
import AppMain from './AppMain.vue'
import Head from './components/head/index.vue'

const route = useRoute()

/**
 * 当前点击的是公共还是私有侧边栏菜单
 */
const currentSidebarItem = ref<MenuItemRegistered | null>(null)
const sidebarStore = useSidebarStore()
const isShowSidebar = computed(() => sidebarStore.isShowSidebar)
// 方便偷懒，有些isShowHead未定义。直接判断是否为 false
const isHideHead = computed<boolean>(() => route.meta?.isShowHead === false)

onMounted(() => {

})
</script>

<template>
  <div>
    <!-- 固定头部 -->
    <Head v-if="!isHideHead" />

    <div
      class="app-wrapper" :class="{ 'no-sidebar': !isShowSidebar, 'no-head ': isHideHead }"
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
  &.no-head {
    top: 0;
  }
}
</style>
