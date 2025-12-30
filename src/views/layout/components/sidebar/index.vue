<script setup lang="ts">
import type { MenuItemRegistered } from 'element-plus'
import router from '@/router'

const sidebarStore = useSidebarStore()
const route = useRoute()
const sidebars = computed(() => sidebarStore.currentSidebars)

function hasTitle(title: string) {
  if (title.length > 5) {
    return title
  }
  else {
    return ''
  }
}

function handleMenuItemClick(item: MenuItemRegistered) {
  sidebarStore.setCurrentSidebarItem(item)
  console.log(item, 'item123456')
  if (sidebarStore.categorySidebars.map(it => it.value,
  ).includes(item.index)) {
    router.push({ path: `/category/project/${item.index}/${route.params.id}` })
  }
}

// 统一用 el-menu 的 select 事件

// 可选：首次挂载时主动触发一次（如果你需要立刻加载“公共”内容）
onMounted(() => {
  const item = {
    index: sidebars.value[0].value,
    indexPath: [sidebars.value[0].value],
    active: true,
  } as MenuItemRegistered
  handleMenuItemClick(item)
})
</script>

<template>
  <div class="sidebar-container">
    <el-scrollbar wrap-class="scrollbar-wrapper" style="background-color: #1c1e23;">
      <el-menu
        text-color="#ffffff"
        :unique-opened="true"
        :collapse-transition="false"
        mode="vertical"
        :default-active="sidebars[0].value"
        class=""
        style="background-color: #1c1e23;"
      >
        <el-menu-item
          v-for="(item) in sidebars"
          :key="item.value"
          :item="item"
          :index="item.value"
          @click="handleMenuItemClick"
        >
          <template #title>
            <span class="menu-title" :title="hasTitle(item.label)">{{ item.label }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
  .sidebar-container {
  transition: width 0.28s;
  width: vars.$sidebar-menu-width !important;
  height: 100%;
  position: fixed !important;
  font-size: 0px;
  top: vars.$header-height;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  .scrollbar-wrapper {
    background-color: #282c34 !important;
  }

  :deep(.el-sub-menu__title:hover) {
    background-color: #2e3033 !important;
  }
  :deep(.el-menu) {
    border-color: #2e3033;
  }

  :deep(.el-menu-item:hover) {
    background-color: #2e3033 !important;
  }
  :deep(.el-menu-item.is-active) {
    background-color: #2e3033 !important;
  }
}
</style>
