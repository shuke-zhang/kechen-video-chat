// mock-category.ts

import type { CascaderOption } from 'element-plus'

export const categoryList2: CascaderOption[] = [
  {
    id: 100,
    name: '项目资料',
    children: [
      {
        id: 110,
        name: '需求文档',
        children: [
          { id: 111, name: '产品需求文档 PRD' },
          { id: 112, name: '交互稿 Axure' },
          { id: 113, name: '原型与评审记录' },
        ],
      },
      {
        id: 120,
        name: '设计资源',
        children: [
          { id: 121, name: 'UI 组件库' },
          { id: 122, name: '图标与插画' },
          { id: 123, name: '品牌规范' },
        ],
      },
      {
        id: 130,
        name: '技术文档',
        children: [
          { id: 131, name: '接口文档 OpenAPI' },
          { id: 132, name: '数据库设计' },
          { id: 133, name: '部署与运维' },
        ],
      },
    ],
  },
  {
    id: 200,
    name: '多媒体',
    children: [
      {
        id: 210,
        name: '视频',
        children: [
          { id: 211, name: '宣传片' },
          { id: 212, name: '教程录屏' },
          { id: 213, name: '直播回放' },
        ],
      },
      {
        id: 220,
        name: '音频',
        children: [
          { id: 221, name: '配乐素材' },
          { id: 222, name: '采访录音' },
          { id: 223, name: '音效库' },
        ],
      },
      {
        id: 230,
        name: '图片',
        children: [
          { id: 231, name: 'Banner 素材' },
          { id: 232, name: '海报模板' },
          { id: 233, name: '摄影集' },
        ],
      },
    ],
  },
  {
    id: 300,
    name: '行政与合规',
    children: [
      {
        id: 310,
        name: '合同与发票',
        children: [
          { id: 311, name: '采购合同' },
          { id: 312, name: '对公发票' },
          { id: 313, name: '结算单' },
        ],
      },
      {
        id: 320,
        name: '人事',
        children: [
          { id: 321, name: '入职材料' },
          { id: 322, name: '请假与加班' },
          { id: 323, name: '绩效评估' },
        ],
      },
      {
        id: 330,
        name: '安全合规',
        children: [
          { id: 331, name: '等保资料' },
          { id: 332, name: '渗透测试报告' },
          { id: 333, name: '隐私条款' },
        ],
      },
    ],
  },
  {
    id: 400,
    name: '归档',
    disabled: true,
    children: [
      {
        id: 410,
        name: '历史版本',
        children: [
          { id: 411, name: 'V1.0' },
          { id: 412, name: 'V1.1' },
          { id: 413, name: 'V2.0' },
        ],
      },
    ],
  },
]
