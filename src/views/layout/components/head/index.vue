<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import type { TopNavValueModel, UserDropdownValueModel } from '@/model/head'
import routes from '@/router/routes'
import TopItem from './topItem.vue'

const router = useRouter()
const route = useRoute()

const UserStore = useUserStore()
const { userName, isLoggedIn } = storeToRefs(UserStore)

const topNavList: {
  label: string
  value: TopNavValueModel
}[] = [
  { label: '项目', value: 'Project' },
  { label: '类别', value: 'Category' },
  { label: '文件', value: 'File' },
  { label: '预测', value: 'Predict' },
  { label: '资审', value: 'Qualification' },
]

const topRoutes = computed(() => {
  const names = topNavList.map(it => it.value)
  const topRoute = routes.filter(r => r.name === 'layout')[0].children || []
  const result = topRoute.filter((r): r is RouteRecordRaw & { name: TopNavValueModel } => {
    return r.name !== undefined && names.includes(r.name as TopNavValueModel)
  },
  )
  return result
})
const activeMenu = computed<string>(() => {
  return route.path
})
const activeNavItem = ref<TopNavValueModel | null>(null)
const dropdownItems: Array<{ label: string, value: UserDropdownValueModel }> = [
  // { label: '修改', value: 'put' },
  { label: '退出', value: 'logout' },
]

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
function syncActive() {
  activeNavItem.value = route.meta.topNavCurrent as TopNavValueModel
}

onMounted(() => {
  syncActive()
})
</script>

<template>
  <header
    class="header-container fixed top-0 right-0 left-0  pr-[20px] bg-white flex items-center z-50 shadow-[inset_0_-2px_0_0_#e5e7eb] box-content"
  >
    <nav class="flex-1 h-full  ">
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        :default-active="activeMenu"
      >
        <TopItem v-for="item in topRoutes" :key="item.name" :item="item" />
      </el-menu>
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
