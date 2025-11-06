import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: 'project',
        name: 'Project',
        component: () => import('@/views/project/index.vue'),
        meta: {
          title: '首页',
          showLeftMenu: true,
          hidden: true,
        },
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/index.vue'),
        meta: {
          title: '类别',
          showLeftMenu: true,
          hidden: true,
        },
      },
      {
        path: 'file',
        name: 'File',
        component: () => import('@/views/file/index.vue'),
        meta: {
          title: '文件',
          showLeftMenu: true,
          hidden: true,
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
]

export default routes
