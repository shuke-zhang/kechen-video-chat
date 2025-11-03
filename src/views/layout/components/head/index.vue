<script setup lang="ts">
import type { ElDropdown } from 'element-plus'
import type { TopNavValueModel, UserDropdownValueModel } from '@/model/head'
import type { SettingDropdownValueModel } from '@/model/setting'

const UserStore = useUserStore()
const { userName, isLoggedIn } = storeToRefs(UserStore)

const router = useRouter()
const isActiveCategory = ref(false)

const currentRoute = ref(router.currentRoute.value.path.replace('/', ''))
// const topNavList = ref<{ label: string, value: TopNavValueModel }[]>([
//   { label: '首页', value: 'home' },
//   { label: '工单', value: 'workOrder' },
//   { label: '设置', value: 'settings' },
// ])

const topNavList = computed(() => {
  const base = [
    { label: '首页', value: 'home' },
    { label: '工单', value: 'workOrder' },
    { label: '设置', value: 'settings' },
  ]
  const categoryList = toRaw(UserStore.categoryList).map((item) => {
    return {
      label: item.name,
      value: item.path,
    }
  })
  const list = insertArrayAfterIndex(base, categoryList) as {
    label: string
    value: TopNavValueModel
  }[]

  return list
})

const dropdownItems: Array<{ label: string, value: UserDropdownValueModel }> = [
  { label: '修改', value: 'put' },
  { label: '退出', value: 'logout' },
]

const settingDropdownItems: Array<{ label: string, value: SettingDropdownValueModel }> = [
  { label: '模型配置', value: 'modelSettings' },
  { label: '音色配置', value: 'voiceSettings' },
  { label: '个人设置', value: 'userProfile' },
  { label: '字典管理', value: 'dict' },
]

const activeNavItem = ref<TopNavValueModel | null>(null)

function handleNavClick(value: TopNavValueModel) {
  if (value === 'settings')
    return

  activeNavItem.value = value
  if (value.includes('category')) {
    currentRoute.value = 'category'
    isActiveCategory.value = true
    return router.push(`/category`)
  }
  isActiveCategory.value = false
  router.push(`/${value}`)
}

function handleCommand(command: UserDropdownValueModel) {
  switch (command) {
    case 'put':
      router.push('/user/profile')
      activeNavItem.value = 'settings'
      break
    case 'logout':
      confirmError('是否确认退出登录', '提示').then(() => {
        UserStore.logout()
      })
      break
  }
}

/**
 * 设置点击
 */
function handleSettingCommand(command: SettingDropdownValueModel) {
  activeNavItem.value = 'settings'
  router.push(`/${command}`)
  currentRoute.value = command
}

/**
 * 点击头像/登录按钮
 */
function handleAvatarClick() {
  if (!isLoggedIn.value) {
    // 未登录 -> 跳转登录页
    UserStore.logout()
  }
}

function insertArrayAfterIndex<T>(oldArr: T[], newArr: T[], num = 0): T[] {
  const pos = Math.min(1, oldArr.length)
  const head = oldArr.slice(num, pos)
  const tail = oldArr.slice(pos)
  return [...head, ...newArr, ...tail]
}

onMounted(() => {
  // 获取用户信息

  if (settingDropdownItems.some(item => item.value === currentRoute.value) || currentRoute.value === 'user/profile') {
    activeNavItem.value = 'settings'
  }
  else {
    activeNavItem.value = currentRoute.value as TopNavValueModel
  }
})
</script>

<template>
  <header
    class="header-container fixed top-0 right-0 left-0  pr-[20px] bg-white flex items-center z-50 shadow-[inset_0_-2px_0_0_#e5e7eb] box-content"
  >
    <div class="app-logo flex-center pr-[6px]">
      <router-link to="/home" />
    </div>
    <el-scrollbar class="flex-1 h-full  ">
      <nav class="flex-1 h-full  ">
        <ul class=" flex  whitespace-nowrap h-[60px]">
          <li
            v-for="item in topNavList"
            :key="item.value"
            class="flex items-center h-full cursor-pointer text-[20px]"
          >
            <!-- 只有“设置”使用下拉 -->
            <template v-if="item.value === 'settings'">
              <el-dropdown
                trigger="click"
                class="h-full"
                @command="handleSettingCommand"
              >
                <div
                  class=" w-[100px] h-full  border-b-[2px] border-transparent hover:text-primary flex-center text-[20px] text-[#303133]"
                  :class="[activeNavItem === item.value ? 'text-primary border-primary!' : '']"
                >
                  {{ item.label }}
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="el in settingDropdownItems"
                      :key="el.value"
                      :command="el.value"
                      :class="{ 'is-active-item': currentRoute === el.value }"
                    >
                      {{ el.label }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>

            <!-- 非“设置”：普通点击跳转 -->
            <template v-else>
              <div
                class=" w-[100px] h-full  border-b-[2px] border-transparent hover:text-primary flex-center"
                :class="[activeNavItem === item.value ? 'text-primary border-primary!' : '']"
                @click="handleNavClick(item.value!)"
              >
                {{ item.label }}
              </div>
            </template>
          </li>
        </ul>
      </nav>
    </el-scrollbar>
    <!-- 右侧登录/用户菜单 -->
    <div class="ml-[20px] ">
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
        @click="handleAvatarClick"
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
