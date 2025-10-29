<script setup lang="ts">
import type { MenuItemRegistered } from 'element-plus'

const emit = defineEmits<{
  (e: 'menu-item-click', item: MenuItemRegistered): void
}>()
const sidebars = [
  {
    label: '公共',
    value: 'public',
  },
  {
    label: '个人',
    value: 'private',
  },
]
const activeKey = ref('public')
function hasTitle(title: string) {
  if (title.length > 5) {
    return title
  }
  else {
    return ''
  }
}

function handleMenuItemClick(item: MenuItemRegistered) {
  // TODO 点击侧边栏菜单项的逻辑
  emit('menu-item-click', item)
}
// 统一用 el-menu 的 select 事件

// 可选：首次挂载时主动触发一次（如果你需要立刻加载“公共”内容）
onMounted(() => {
  const item = {
    index: '公共',
    indexPath: ['public'],
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
        :default-active="activeKey"
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
  -webkit-box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  .scrollbar-wrapper {
    background-color: #282c34 !important;
  }

  :deep(.el-sub-menu__title:hover) {
    background-color: #2e3033 !important;
  }

  :deep(.el-menu-item:hover) {
    background-color: #2e3033 !important;
  }
  :deep(.el-menu-item.is-active) {
    background-color: #2e3033 !important;
  }
}
</style>
