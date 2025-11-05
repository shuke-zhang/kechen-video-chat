import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
const whiteList = ['/login', '/register']

function isWhiteList(path: string) {
  return whiteList.some(pattern => isPathMatch(pattern, path))
}
router.beforeEach(async (to) => {
  const token = getCacheToken().value

  // 1) allow allowlist entries (e.g. /login, 404, about)
  if (isWhiteList(to.path)) {
    // if already signed in and visiting /login, redirect home
    if (to.path === '/login' && token) {
      return { path: '/' }
    }
    return true
  }

  // 2) missing token -> send to login (with redirect hint)
  if (!token) {
    console.log('missing token')
    return true
    // return { path: '/login', query: { redirect: to.fullPath } }
  }

  // 3) token exists
  const userStore = useUserStore()
  try {
    // fetch user info once after the first load/refresh

    if (!userStore.userInfo?.name) {
      // await userStore.getInfo()
      return true
    }

    return true
  }
  catch (_err: any) {
    // fallback: clear session + notify + go login
    await userStore.logout()
    // response interceptors already surfaced the message
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
