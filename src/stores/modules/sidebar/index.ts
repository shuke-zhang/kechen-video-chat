import type { MenuItemRegistered } from 'element-plus'

export const useSidebarStore = defineStore('sidebar', () => {
  const route = useRoute()
  const currentSidebarItem = ref<MenuItemRegistered | null>(null)
  const currentPublicStatus = computed(() => {
    console.log('测试', currentSidebarItem.value)
    if (!currentSidebarItem.value) {
      return 0 // 执行时机的问题直接取公共第一个
    }

    return currentSidebarItem.value?.index === 'public' ? 0 : 1
  })
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
  const categorySidebars = [
    {
      label: '视频',
      value: 'video',
    },
    {
      label: '角色',
      value: 'role',
    },
    {
      label: '音色',
      value: 'voices',
    },
  ]
  const currentSidebars = ref(publicSidebars)
  const defaultActiveMenu = ref(publicSidebars[0].value)
  const isShowSidebar = ref(!!route.meta?.showLeftMenu)

  /**
   * 设置侧边栏
   */
  function setCurrentSidebarItem(item: MenuItemRegistered) {
    currentSidebarItem.value = item
  }

  watch(() => route.path, () => {
    currentSidebars.value = route.path.includes('category/project') ? categorySidebars : publicSidebars
    if (route.path.includes('category')) {
      isShowSidebar.value = true
      return
    }
    if (typeof route.meta?.showLeftMenu === 'boolean') {
      isShowSidebar.value = route.meta.showLeftMenu
    }
  }, {
    immediate: true,
  })
  return {
    categorySidebars,
    publicSidebars,
    isShowSidebar,
    currentSidebarItem,
    currentSidebars,
    defaultActiveMenu,
    currentPublicStatus,
    setCurrentSidebarItem,
  }
}, {
  persist: {
    key: 'SIDEBAR',
    storage: localStorage,
  },
})
