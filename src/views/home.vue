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
      <div class="body-item-title flex items-center justify-between fz-20">
        <div>测试</div>
      </div>
      <div class="body-item-content flex">
        <div
          class="content-item mt-20 border-radius-20 bg-white flex flex-col justify-between"
        >
          <el-tooltip placement="top">
            <template #content>
              哈哈哈
            </template>

            <template #default>
              <div>
                <div class="content-item-img border-radius-20 bg-white flex-center menuIcon">
                  <!-- <SvgIcon :icon-class="subItem.icon!" size="43" color="#7c91fc" /> -->
                </div>
                <div class="flex justify-center">
                  <!-- <span class="line-clamp-1">111</span> -->
                </div>
              </div>
            </template>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.body-item {
  padding: 20px 60px;
  overflow: hidden;
  .body-item-title {
    height: 30px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(-9px, -50%);
      height: 20px;
      width: 5px;
      border-radius: 10px;
      background-color: global.$color-system-primary;
    }
  }
  .body-item-content {
    .content-item {
      width: 80px;
      height: 120px;
      min-width: 80px;
      min-height: 120px;
      cursor: pointer;
      &:hover {
        color: $color-primary;
      }
    }
    .content-item-img {
      height: 80px;
      box-shadow: 0px 3px 5px 1px rgba(223, 231, 243, 1);
    }
    .content-item + .content-item {
      margin-left: 80px;
    }
  }
}
</style>
