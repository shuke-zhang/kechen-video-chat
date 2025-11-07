<script setup lang="ts">
import type { TopNavValueModel, UserDropdownValueModel } from '@/model/head'
import { log } from 'node:console'

const router = useRouter()

const UserStore = useUserStore()
const { userName, isLoggedIn } = storeToRefs(UserStore)
const currentRoute = ref(router.currentRoute.value.path)

const topNavList: {
  label: string
  value: TopNavValueModel
}[] = [
  { label: '项目', value: 'project' },
  { label: '类别', value: 'category' },
  { label: '文件', value: 'file' },
]

const activeNavItem = ref<TopNavValueModel | null>(null)
const dropdownItems: Array<{ label: string, value: UserDropdownValueModel }> = [
  // { label: '修改', value: 'put' },
  { label: '退出', value: 'logout' },
]

function handleNavClick(value: TopNavValueModel) {
  console.log(value, 'value')

  activeNavItem.value = value
  router.push(`/${value}`)
}

function handleCommand(command: UserDropdownValueModel) {
  switch (command) {
    case 'put':
      router.push('/user/profile')
      break
    case 'logout':
      confirmError('是否确认退出登录', '提示').then(() => {
        UserStore.logout()
      })
      break
  }
}

onMounted(() => {
  let path = currentRoute.value.replace(/^\//, '') as TopNavValueModel
  if (path.includes('project')) {
    path = 'project'
  }
  activeNavItem.value = path
})
</script>

<template>
  <header
    class="header-container fixed top-0 right-0 left-0  pr-[20px] bg-white flex items-center z-50 shadow-[inset_0_-2px_0_0_#e5e7eb] box-content"
  >
    <nav class="flex-1 h-full  ">
      <ul class=" flex  whitespace-nowrap h-[60px]">
        <li
          v-for="item in topNavList"
          :key="item.value"
          class="flex items-center h-full cursor-pointer text-[20px]"
        >
          <div
            class=" w-[100px] h-full  border-b-[2px] border-transparent hover:text-primary flex-center"
            :class="[activeNavItem === item.value ? 'text-primary border-primary!' : '']"
            @click="handleNavClick(item.value!)"
          >
            {{ item.label }}
          </div>
        </li>
      </ul>
    </nav>

    <!-- 右侧登录/用户菜单 -->
    <div v-if="false" class="ml-[20px] ">
      <el-dropdown
        v-if="isLoggedIn"
        trigger="click"
        @command="handleCommand"
      >
        <span
          class="flex-center size-[40px] bg-primary-300 rounded-full text-xs hover:cursor-pointer hover:bg-primary-500"
        >
          {{ userName }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in dropdownItems"
              :key="item.value"
              :command="item.value"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 未登录时：点击直接跳转 -->
      <span
        v-else
        class="flex-center size-[40px] bg-primary-300 rounded-full text-xs hover:cursor-pointer hover:bg-primary-500"
      >
        登录
      </span>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-logo {
  width: vars.$sidebar-menu-width;
  height: vars.$header-height;
  background-image: url('@/assets/logo.png');
  background-size: cover;
  background-repeat: no-repeat; /* 防止图片重复 */
  cursor: pointer;
  // 添加右侧阴影
}
.header-container {
  height: vars.$header-height;
}
/* 如果是 <style scoped>，这一段直接写就行；不需要 deep */
:deep(.is-active-item) {
  color: var(--el-dropdown-menuItem-hover-color);
  background-color: var(--el-dropdown-menuItem-hover-fill);
}
/* 选中项被 hover 时，保持不变，避免“二次变色/闪动” */
:deep(.is-active-item:hover) {
  color: var(--el-dropdown-menuItem-hover-color);
  background-color: var(--el-dropdown-menuItem-hover-fill);
}
</style>
