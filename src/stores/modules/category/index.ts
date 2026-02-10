import type { CategoryModel } from '@/model/category'
import type { VideoProjectModel } from '@/model/videoProject'
import { getCategoryList } from '@/api/category'

export const useCategoryStore = defineStore('category', () => {
  const categoryList = ref<CategoryModel[]>([])
  const videoProjectList = ref<VideoProjectModel[]>([])
  const currentProject = ref<VideoProjectModel>()
  const currentCategory = ref<CategoryModel>()
  const currentCategoryId = ref<number>()
  return {
    videoProjectList,
    categoryList,
    currentProject,
    currentCategory,
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
    const list: CategoryModel[] = res.data.records.map((item) => {
      return {
        ...item,
        path: `/category/${item.id}`,
        showCharacter: Number(item.id) !== 3,
        showTextTitle: Number(item.id) !== 4,
      }
    })
    categoryList.value = list
    if (list.length > 0) {
      currentCategoryId.value = list[0].id
      currentCategory.value = list[0]
    }
  }
}, {
  persist: {
    key: 'CATEGORY',
    storage: localStorage,
  },
})
