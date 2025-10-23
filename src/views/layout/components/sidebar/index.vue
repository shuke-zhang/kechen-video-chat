<script setup lang="ts">
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
function hasTitle(title: string) {
  if (title.length > 5) {
    return title
  }
  else {
    return ''
  }
}
</script>

<template>
  <div class="sidebar-container">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        text-color="#5cc991"
        :unique-opened="true"
        active-text-color="#ff9632"
        :collapse-transition="false"
        mode="vertical"
      >
        <el-menu-item
          v-for="(item) in sidebars"
          :key="item.value"
          :item="item"
          :index="item.value"
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
    background-color: #282c34;
  }
  // reset element-ui css
  .horizontal-collapse-transition {
    transition:
      0s width ease-in-out,
      0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .el-scrollbar__bar.is-vertical {
    right: 0px;
  }

  .el-scrollbar {
    height: 100%;
  }

  &.has-logo {
    .el-scrollbar {
      height: calc(100% - 50px);
    }
  }

  .is-horizontal {
    display: none;
  }

  a {
    display: inline-block;
    width: 100%;
    overflow: hidden;
  }

  .svg-icon {
    margin-right: 16px;
  }

  .el-menu {
    border: none;
    height: 100%;
    width: 100% !important;
  }

  .el-menu-item,
  .menu-title {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  .el-menu-item .el-menu-tooltip__trigger {
    display: inline-block !important;
  }

  // menu hover
  .sub-menu-title-noDropdown,
  .el-sub-menu__title {
    &:hover {
      background-color: rgba(0, 0, 0, 0.06) !important;
    }
  }

  & .theme-dark .is-active > .el-sub-menu__title {
    color: #f4f4f5 !important;
  }

  & .nest-menu .el-sub-menu > .el-sub-menu__title,
  & .el-sub-menu .el-menu-item {
    min-width: vars.$sidebar-menu-width !important;

    &:hover {
      background-color: rgba(0, 0, 0, 0.06) !important;
    }
  }

  & .theme-dark .nest-menu .el-sub-menu > .el-sub-menu__title,
  & .theme-dark .el-sub-menu .el-menu-item {
    background-color: #1f2d3d;

    &:hover {
      background-color: #001528 !important;
    }
  }
}

.hideSidebar {
  .sidebar-container {
    width: 54px !important;
  }

  .main-container {
    margin-left: 54px;
  }

  .sub-menu-title-noDropdown {
    padding: 0 !important;
    position: relative;

    .el-tooltip {
      padding: 0 !important;

      .svg-icon {
        margin-left: 20px;
      }
    }
  }

  .el-sub-menu {
    overflow: hidden;

    & > .el-sub-menu__title {
      padding: 0 !important;

      .svg-icon {
        margin-left: 20px;
      }
    }
  }

  .el-menu--collapse {
    .el-sub-menu {
      & > .el-sub-menu__title {
        & > span {
          height: 0;
          width: 0;
          overflow: hidden;
          visibility: hidden;
          display: inline-block;
        }
        & > i {
          height: 0;
          width: 0;
          overflow: hidden;
          visibility: hidden;
          display: inline-block;
        }
      }
    }
  }
}
</style>
