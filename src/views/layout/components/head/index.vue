<script setup lang="ts">
import type { ElDropdown } from 'element-plus'
import type { TopNavValueModel, UserDropdownValueModel } from '@/model/head'
import type { SettingDropdownValueModel } from '@/model/setting'

const UserStore = useUserStore()
const { userName, isLoggedIn } = storeToRefs(UserStore)
watch(() => userName.value, (newVal) => {
  console.log(newVal, 'userName')
})
const router = useRouter()
const currentRoute = ref(router.currentRoute.value.path.replace('/', ''))
const topNavList: Array<{ label: string, value: TopNavValueModel }> = [
  { label: '首页', value: 'home' },
  { label: '类别1', value: 'category1' },
  { label: '类别2', value: 'category2' },
  { label: '类别3', value: 'category3' },
  { label: '类别4', value: 'category4' },
  { label: '类别5', value: 'category5' },
  { label: '类别6', value: 'category6' },
  { label: '工单', value: 'workOrder' },
  { label: '设置', value: 'settings' },
]

const dropdownItems: Array<{ label: string, value: UserDropdownValueModel }> = [
  { label: '修改', value: 'put' },
  { label: '退出', value: 'logout' },
]

const settingDropdownItems: Array<{ label: string, value: SettingDropdownValueModel }> = [
  { label: '模型配置', value: 'modelSettings' },
  { label: '音色配置', value: 'voiceSettings' },
  { label: '个人设置', value: 'userProfile' },
]

const activeNavItem = ref<TopNavValueModel | null>(null)

function handleNavClick(value: TopNavValueModel) {
  if (value === 'settings')
    return
  console.log(value.includes('category'), '测试')

  activeNavItem.value = value
  if (value.includes('category')) {
    currentRoute.value = 'category'
    return router.push(`/category`)
  }
  router.push(`/${value}`)
}

function handleCommand(command: UserDropdownValueModel) {
  switch (command) {
    case 'put':
      // console.log('修改')
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
    class="header-container fixed top-0 right-0 left-0  px-5 bg-white flex items-center z-50 shadow-[inset_0_-2px_0_0_#e5e7eb] box-content"
  >
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
                @command="handleSettingCommand"
              >
                <div
                  class=" w-[100px] h-full  border-b-[2px] border-transparent hover:text-primary flex-center text-[20px]"
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
                @click="handleNavClick(item.value)"
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
