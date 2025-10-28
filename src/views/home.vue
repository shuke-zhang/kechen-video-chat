<script setup lang="ts">
import type { MenuItemRegistered } from 'element-plus'

const props = defineProps({
  currentSidebarItem: {
    type: Object as PropType<MenuItemRegistered | null>,
    required: false,
    default: null,
  },
})
watch(
  () => props.currentSidebarItem,
  (newVal) => {
    console.log('当前侧边栏选中的菜单项发生变化：', newVal)
    // TODO 根据侧边栏选中的菜单项，执行相应的逻辑
  },
)
</script>

<template>
  <div class="app-container">
    <div class="body-item border-radius-20 bg-white flex flex-col justify-between">
      <div class="body-item-title flex items-center justify-between fz-20 border-b border-b-[#ccc] border-solid pl-[20px] pr-[20px]">
        <div>测试</div>
      </div>
      <div class="body-item-content flex p-[20px] ">
        内容
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.body-item {
  overflow: hidden;
  border-radius: 6px;
  .body-item-title {
    height: 40px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translate(0px, -50%);
      height: 20px;
      width: 5px;
      border-radius: 8px;
      background-color: global.$color-system-primary;
    }
  }

  & + .body-item {
    margin-top: 20px;
  }
}
</style>
