import type { UserModel } from '@/model/user'
import { defineStore } from 'pinia'
import { getUserInfo as _getUserInfo, loginApi } from '@/api/login'
import { outUser } from '@/api/user'
import { removeCacheToken, setCacheToken } from '@/utils/cache'

const SUPER_ADMIN = 'admin'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()
  const route = useRoute()
  const localUser = ref<UserModel | null>(getCache<UserModel>('USER_INFO')?.value || null)
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
    console.log(res.data, '登录成功')

    setCacheToken(res.data)
    setCache('IS_LOGGED_IN', true)
    // await getInfo()
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
    console.log(userName.value, 'userName')

    userInfo.value = res.data
    setCache('IS_LOGGED_IN', true)
    setCache('USER_INFO', res.data)
  }

  function resetAllState() {
    userName.value = null
    roles.value = []
    permissions.value = []
    isLoggedIn.value = false
    removeCacheToken()
    removeCache('IS_LOGGED_IN')
    removeCache('USER_INFO')
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
