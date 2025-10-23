import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/home.vue'),
          meta: {
            title: '首页',
            showLeftMenu: true,
            hidden: true,
          },
        },
        {
          path: 'workOrder',
          name: 'WorkOrder',
          component: () => import('@/views/workOrder/index.vue'),
          meta: {
            title: '工单',
            showLeftMenu: false,
            hidden: true,
          },
        },

        {
          path: 'patient',
          name: 'patient',
          component: () => import('@/views/patient/index.vue'),
          meta: {
            title: '患者',
            hidden: true,
          },
        },

        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/settings/index.vue'),
          meta: {
            title: '设置',
            hidden: true,
          },
        },
        {
          path: 'video',
          name: 'Video',
          component: () => import('@/views/settings/video/index.vue'),
          meta: {
            title: '视频',
            hidden: true,
          },
        },
        {
          path: 'videoCategory',
          name: 'VideoCategory',
          component: () => import('@/views/settings/videoCategory/index.vue'),
          meta: {
            title: '视频类别',
            hidden: true,
          },
        },
        {
          path: 'videoPlan',
          name: 'VideoPlan',
          component: () => import('@/views/settings/videoPlan/index.vue'),
          meta: {
            title: '视频方案',
            hidden: true,
          },
        },
        {
          path: '/user/profile',
          name: 'UserProfile',
          component: () => import('@/views/settings/user/profile.vue'),
          meta: {
            title: '用户管理',
            hidden: true,
          },
        },
        {
          path: 'userManagement',
          name: 'UserManagement',
          component: () => import('@/views/settings/user/index.vue'),
          meta: {
            title: '用户信息修改',
            hidden: true,
          },
        },
        {
          path: 'dict',
          name: 'Dict',
          component: () => import('@/views/settings/dict/index.vue'),
          meta: {
            title: '字典管理',
            hidden: true,
          },
        },
        {
          path: 'dict/data/:dictType',
          name: 'DictData',
          component: () => import('@/views/settings/dict/data.vue'),
          // props: true, // 自动注册为props
          meta: {
            title: '字典数据',
            hidden: true,
          },
        },

      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),
      meta: {
        title: '登录',
        hidden: true,
      },
    },

  ],
})
const whiteList = ['/login', '/register']

function isWhiteList(path: string) {
  return whiteList.some(pattern => isPathMatch(pattern, path))
}
router.beforeEach(async (to) => {
  const token = getCacheToken().value

  // 1) 先放行白名单（如 /login、/404、/about 等）
  if (isWhiteList(to.path)) {
    // 如果是 /login 且已有 token，可选：跳首页
    if (to.path === '/login' && token) {
      return { path: '/' }
    }
    return true
  }

  // 2) 没有 token，跳登录并带上 redirect
  if (!token) {
    console.log('没有token')
    return true
    // return { path: '/login', query: { redirect: to.fullPath } }
  }

  // 3) 有 token
  const userStore = useUserStore()
  try {
    // 只在首次进入或刷新后拉一次用户信息

    if (!userStore.userInfo?.name) {
      // await userStore.getInfo()
      return true
    }
    return true
  }
  catch (_err: any) {
    // 失败兜底：清理登录态 + 提示 + 去登录
    await userStore.logout()
    // 响应拦截器已经处理提示信息了， 不用重复提示
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
