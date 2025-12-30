import type { MenuItemRegistered } from 'element-plus'

export const useSidebarStore = defineStore('sidebar', () => {
  const route = useRoute()

  const currentSidebarItem = ref<MenuItemRegistered | null>(null)

  const isShowSidebar = ref(!!route.meta?.showLeftMenu)
  function setIsShowSidebar(value: boolean) {
    isShowSidebar.value = value
  }

  /**
   * 设置侧边栏
   */
  function setCurrentSidebarItem(item: MenuItemRegistered) {
    currentSidebarItem.value = item
  }

  watch(() => route.path, () => {
    console.log('route.path', route.path)

    if (route.path.includes('category')) {
      isShowSidebar.value = true
      console.log(isShowSidebar.value, 'route.path')
      return
    }
    if (typeof route.meta?.showLeftMenu === 'boolean') {
      isShowSidebar.value = route.meta.showLeftMenu
    }
    console.log('结果', isShowSidebar.value)
  }, {
    immediate: true,
  })
  return {
    isShowSidebar,
    currentSidebarItem,
    setIsShowSidebar,
    setCurrentSidebarItem,
  }
}, {
  persist: {
    key: 'SIDEBAR',
    storage: localStorage,
  },
})
