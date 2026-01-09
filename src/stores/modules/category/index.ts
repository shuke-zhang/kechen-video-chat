import type { CategoryModel } from '@/model/category'
import { getCategoryList } from '@/api/category'

export const useCategoryStore = defineStore('category', () => {
  const categoryList = ref<CategoryModel[]>([])
  const currentProjectId = ref<number>()
  return {
    categoryList,
    currentProjectId,
    getCategory,
  }
  async function getCategory() {
    const res = await getCategoryList({
      page: {
        current: 1,
        size: 1000,
      },
    })
    const list = res.data.records.map((item) => {
      return {
        ...item,
        path: `/category/${item.id}`,
      }
    })

    categoryList.value = list
  }
}, {
  persist: {
    key: 'CATEGORY',
    storage: localStorage,
  },
})
