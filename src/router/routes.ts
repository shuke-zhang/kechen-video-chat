import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/project',
    children: [
      {
        path: 'project',
        name: 'Project',
        component: () => import('@/views/project/index.vue'),
        meta: {
          title: '项目',
          showLeftMenu: true,
          hidden: true,
        },
      },
      {
        path: 'project/timesBid/:id',
        name: 'TimesBid',
        component: () => import('@/views/project/timesBid.vue'),
        meta: {
          title: '生成次数管理',
          hidden: true,
        },
      },
      {
        path: 'project/genbid/:timesBidId',
        name: 'Genbid',
        component: () => import('@/views/project/genbid.vue'),
        meta: {
          title: '生成表管理',
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
      {
        path: 'predict',
        name: 'predict',
        component: () => import('@/views/predict/index.vue'),
        meta: {
          title: '预测',
          showLeftMenu: true,
          hidden: true,
        },
      },
      {
        path: 'predict/response',
        name: 'PredictResponse',
        component: () => import('@/views/predict/predictResponse.vue'),
        meta: {
          title: '预测结果',
          showLeftMenu: false,
          isShowHead: false,
          hidden: true,
        },
      },
      {
        path: 'predict/history',
        name: 'PredictHistory',
        component: () => import('@/views/predict/history.vue'),
        meta: {
          title: '预测历史',
          showLeftMenu: false,
        },
      },
      {
        path: 'qualification',
        name: 'Qualification',
        component: () => import('@/views/qualification/index.vue'),
        meta: {
          title: '资审',
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
