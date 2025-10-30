<script setup lang="ts">
import type { MenuItemRegistered } from 'element-plus'
import { sidebarVideo } from './video'

const emit = defineEmits<{
  (e: 'menu-item-click', item: MenuItemRegistered): void
}>()
const route = useRoute()
const isActiveCategory = ref(false)
const publicSidebars = [
  {
    label: '公共',
    value: 'public',
  },
  {
    label: '个人',
    value: 'private',
  },
]
const sidebars = computed(() => isActiveCategory.value ? sidebarVideo : publicSidebars)
const activeKey = ref('')
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

  // 获取当前页面路由中是否包含了category
})
// 监听路由变化
watch(
  () => route.fullPath,
  (newPath) => {
    console.log(route, '路由')
    const item = {
      index: newPath.includes('category') ? sidebarVideo[0].label : publicSidebars[0].label,
      indexPath: [newPath.includes('category') ? sidebarVideo[0].value : publicSidebars[0].value],
      active: true,
    } as MenuItemRegistered
    handleMenuItemClick(item)
    isActiveCategory.value = newPath.includes('category')
    activeKey.value = newPath.includes('category') ? sidebarVideo[0].value : publicSidebars[0].value
  },
  { immediate: true },
)
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
