import type { CategoryModel } from '@/model/category'
import type { VideoProjectModel } from '@/model/videoProject'
import { getCategoryList } from '@/api/category'

export const useCategoryStore = defineStore('category', () => {
  const categoryList = ref<CategoryModel[]>([])
  const videoProjectList = ref<VideoProjectModel[]>([])
  const currentProject = ref<VideoProjectModel>()
  const currentCategoryId = ref<number>()
  return {
    videoProjectList,
    categoryList,
    currentProject,
    currentCategoryId,
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
    if (list.length > 0) {
      currentCategoryId.value = list[0].id
    }
  }
}, {
  persist: {
    key: 'CATEGORY',
    storage: localStorage,
  },
})
