export const useSidebarStore = defineStore('sidebar', () => {
  const route = useRoute()

  const isShowSidebar = ref(!!route.meta?.showLeftMenu)
  function setIsShowSidebar(value: boolean) {
    isShowSidebar.value = value
  }
  watch(() => route.path, () => {
    if (route.path.includes('category')) {
      return isShowSidebar.value = false
    }
    if (typeof route.meta?.showLeftMenu === 'boolean') {
      isShowSidebar.value = route.meta.showLeftMenu
    }
  })
  return {
    isShowSidebar,
    setIsShowSidebar,
  }
})
