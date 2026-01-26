import type { VideoModel } from '@/model/video'

export const useAddVideo = defineStore('addVideo', () => {
  const isAdd = ref(false)
  const currentData = ref<VideoModel>({})
  return {
    isAdd,
    currentData,
  }
}, {
  persist: {
    key: 'ADDVIDEO',
    storage: localStorage,
  },
})
