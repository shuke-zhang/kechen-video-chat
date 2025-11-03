import type { CategoryModel } from '@/model/category'
import type { UserModel } from '@/model/user'
import { defineStore } from 'pinia'
import { getCategoryList } from '@/api/category'
import { getUserInfo as _getUserInfo, loginApi } from '@/api/login'
import { removeCacheToken, setCacheToken } from '@/utils/cache'

const SUPER_ADMIN = 'admin'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const route = useRoute()
  const localUser = ref<UserModel | null>(getCache<UserModel>('USER_INFO')?.value || null)
  const categoryList = ref<CategoryModel[]>(getCache<CategoryModel[]>('CATEGORY_LIST')?.value || [])
  const userInfo = ref<UserModel | null>(localUser.value || null)
  const userName = ref<UserModel['name'] | null>(localUser?.value ? localUser?.value.name : null)
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const avater = ref()
  /** 是否已经登录 */
  const isLoggedIn = ref<boolean>(!!getCache<boolean>('IS_LOGGED_IN')?.value)
  return {
    userInfo,
    userName,
    categoryList,
    roles,
    permissions,
    avater,
    isLoggedIn,
    login,
    logout,
    getInfo,
    resetAllState,
    hasPermission,
    hasRole,
  }

  async function login(...args: Parameters<typeof loginApi>) {
    const res = await loginApi(...args)
    isLoggedIn.value = true

    setCacheToken(res.data)
    setCache('IS_LOGGED_IN', true)
    await getInfo()
    await getCategory()
  }
  function logout() {
    resetAllState()
    removeCacheToken()
    router.replace({
      path: '/login',
      query: { redirect: route.fullPath },
    })
  }

  async function getInfo() {
    const res = await _getUserInfo()
    userName.value = res.data.name || '默认'
    userInfo.value = res.data
    setCache('IS_LOGGED_IN', true)
    setCache('USER_INFO', res.data)
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
    setCache('CATEGORY_LIST', list)
  }

  function resetAllState() {
    userName.value = null
    roles.value = []
    permissions.value = []
    isLoggedIn.value = false
    removeCacheToken()
    removeCache('IS_LOGGED_IN')
    removeCache('USER_INFO')
    removeCache('CATEGORY_LIST')
  }

  function hasPermission(requiredPermission: string): boolean {
    return permissions.value.includes(requiredPermission)
  }

  function hasRole(requiredRole: string): boolean {
    if (roles.value.includes(SUPER_ADMIN))
      return true
    return roles.value.includes(requiredRole)
  }
})
