import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          showLeftMenu: true,
          hidden: true,
        },
      },
      {
        path: 'category/:id',
        name: 'Category',
        component: () => import('@/views/category/index.vue'),
        meta: {
          title: '类别',
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
          showLeftMenu: true,
          hidden: true,
        },
      },
      {
        path: 'video',
        component: () => import('@/views/settings/video/index.vue'),
        meta: {
          title: '视频',
          showLeftMenu: false,
          hidden: true,
        },
      },
      {
        path: 'videoCategory',
        name: 'VideoCategory',
        component: () => import('@/views/settings/videoCategory/index.vue'),
        meta: {
          title: '视频类别',
          showLeftMenu: false,
          hidden: true,
        },
      },
      {
        path: 'videoPlan',
        name: 'VideoPlan',
        component: () => import('@/views/settings/videoPlan/index.vue'),
        meta: {
          title: '视频方案',
          showLeftMenu: false,
          hidden: true,
        },
      },
      {
        path: 'user/profile',
        name: 'UserProfile',
        component: () => import('@/views/settings/user/profile.vue'),
        meta: {
          title: '用户管理',
          showLeftMenu: false,
          hidden: true,
        },
      },
      {
        path: 'userManagement',
        name: 'UserManagement',
        component: () => import('@/views/settings/user/index.vue'),
        meta: {
          title: '用户信息修改',
          showLeftMenu: false,
          hidden: true,
        },
      },
      {
        path: '/settings',
        name: 'settings',
        meta: {
          title: '设置',
          showLeftMenu: false,
          hidden: true,
        },
        children: [
          {
            path: '/settings/dict',
            name: 'Dict',
            component: () => import('@/views/settings/dict/index.vue'),
            meta: {
              title: '字典管理',
              hidden: false,
            },
          },
          {
            path: '/settings/dict/data/:dictType',
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
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register.vue'),
    meta: {
      title: '注册',
      hidden: true,
    },
  },

]

export default routes
