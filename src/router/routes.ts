import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    name: 'layout',
    redirect: '/project',
    children: [
      {
        path: 'project',
        name: 'Project',
        component: () => import('@/views/project/index.vue'),
        meta: {
          title: '项目',
          topNavCurrent: 'Project',
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
          topNavCurrent: 'Project',
          hidden: true,
        },
      },
      {
        path: 'project/genbid/:timesBidId',
        name: 'Genbid',
        component: () => import('@/views/project/genbid.vue'),
        meta: {
          title: '生成表管理',
          topNavCurrent: 'Project',
          hidden: true,
        },
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/index.vue'),
        meta: {
          title: '类别',
          topNavCurrent: 'Category',
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
          topNavCurrent: 'File',
          showLeftMenu: true,
          hidden: true,
        },
      },
      {
        path: 'predict',
        name: 'Predict',
        component: () => import('@/views/predict/index.vue'),
        meta: {
          title: '预测',
          topNavCurrent: 'Predict',
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
          topNavCurrent: 'PredictResponse',
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
          topNavCurrent: 'PredictHistory',
          showLeftMenu: false,
        },
      },
      {
        path: 'qualification',
        name: 'Qualification',
        meta: {
          title: '资审',
          topNavCurrent: 'Qualification',
          showLeftMenu: true,
          hidden: true,
        },
        children: [
          {
            path: 'company',
            name: 'Company',
            component: () => import('@/views/qualification/company.vue'),
            meta: {
              title: '公司信息',
              topNavCurrent: 'Qualification',
              showLeftMenu: false,
            },
          },
          {
            path: 'staff',
            name: 'Staff',
            component: () => import('@/views/qualification/employee.vue'),
            meta: {
              title: '员工管理',
              topNavCurrent: 'Qualification',
              showLeftMenu: false,
            },
          },
          {
            path: 'promise',
            name: 'Promise',
            component: () => import('@/views/qualification/promise.vue'),
            meta: {
              title: '承诺书',
              topNavCurrent: 'Qualification',
              showLeftMenu: false,
            },
          },
          {
            path: 'policies',
            name: 'Policies',
            component: () => import('@/views/qualification/policies.vue'),
            meta: {
              title: '政策法规',
              topNavCurrent: 'Qualification',
              showLeftMenu: false,
            },
          },
        ],
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
