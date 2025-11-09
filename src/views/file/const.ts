// mock-category.ts

import type { CascaderOption } from 'element-plus'
import { markDisabledLevels } from '@/utils'

export const categoryList2: CascaderOption[] = [
  {
    id: 100,
    name: '项目资料',
    parentId: 0,
    parentName: '',
    sort: 1,
    containParent: '',
    children: [
      {
        id: 110,
        name: '需求文档',
        parentId: 100,
        parentName: '项目资料',
        sort: 1,
        containParent: '100',
        children: [
          { id: 111, name: '产品需求文档 PRD', parentId: 110, parentName: '需求文档', sort: 1, containParent: '100,110' },
          { id: 112, name: '交互稿 Axure', parentId: 110, parentName: '需求文档', sort: 2, containParent: '100,110' },
          { id: 113, name: '原型与评审记录', parentId: 110, parentName: '需求文档', sort: 3, containParent: '100,110' },
        ],
      },
      {
        id: 120,
        name: '设计资源',
        parentId: 100,
        parentName: '项目资料',
        sort: 2,
        containParent: '100',
        children: [
          { id: 121, name: 'UI 组件库', parentId: 120, parentName: '设计资源', sort: 1, containParent: '100,120' },
          { id: 122, name: '图标与插画', parentId: 120, parentName: '设计资源', sort: 2, containParent: '100,120' },
          { id: 123, name: '品牌规范', parentId: 120, parentName: '设计资源', sort: 3, containParent: '100,120' },
        ],
      },
      {
        id: 130,
        name: '技术文档',
        parentId: 100,
        parentName: '项目资料',
        sort: 3,
        containParent: '100',
        children: [
          { id: 131, name: '接口文档 OpenAPI', parentId: 130, parentName: '技术文档', sort: 1, containParent: '100,130' },
          { id: 132, name: '数据库设计', parentId: 130, parentName: '技术文档', sort: 2, containParent: '100,130' },
          { id: 133, name: '部署与运维', parentId: 130, parentName: '技术文档', sort: 3, containParent: '100,130' },
        ],
      },
    ],
  },
  {
    id: 200,
    name: '多媒体',
    parentId: 0,
    parentName: '',
    sort: 2,
    containParent: '',
    children: [
      {
        id: 210,
        name: '视频',
        parentId: 200,
        parentName: '多媒体',
        sort: 1,
        containParent: '200',
        children: [
          { id: 211, name: '宣传片', parentId: 210, parentName: '视频', sort: 1, containParent: '200,210' },
          { id: 212, name: '教程录屏', parentId: 210, parentName: '视频', sort: 2, containParent: '200,210' },
          { id: 213, name: '直播回放', parentId: 210, parentName: '视频', sort: 3, containParent: '200,210' },
        ],
      },
      {
        id: 220,
        name: '音频',
        parentId: 200,
        parentName: '多媒体',
        sort: 2,
        containParent: '200',
        children: [
          { id: 221, name: '配乐素材', parentId: 220, parentName: '音频', sort: 1, containParent: '200,220' },
          { id: 222, name: '采访录音', parentId: 220, parentName: '音频', sort: 2, containParent: '200,220' },
          { id: 223, name: '音效库', parentId: 220, parentName: '音频', sort: 3, containParent: '200,220' },
        ],
      },
      {
        id: 230,
        name: '图片',
        parentId: 200,
        parentName: '多媒体',
        sort: 3,
        containParent: '200',
        children: [
          { id: 231, name: 'Banner 素材', parentId: 230, parentName: '图片', sort: 1, containParent: '200,230' },
          { id: 232, name: '海报模板', parentId: 230, parentName: '图片', sort: 2, containParent: '200,230' },
          { id: 233, name: '摄影集', parentId: 230, parentName: '图片', sort: 3, containParent: '200,230' },
        ],
      },
    ],
  },
  {
    id: 300,
    name: '行政与合规',
    parentId: 0,
    parentName: '',
    sort: 3,
    containParent: '',
    children: [
      {
        id: 310,
        name: '合同与发票',
        parentId: 300,
        parentName: '行政与合规',
        sort: 1,
        containParent: '300',
        children: [
          { id: 311, name: '采购合同', parentId: 310, parentName: '合同与发票', sort: 1, containParent: '300,310' },
          { id: 312, name: '对公发票', parentId: 310, parentName: '合同与发票', sort: 2, containParent: '300,310' },
          { id: 313, name: '结算单', parentId: 310, parentName: '合同与发票', sort: 3, containParent: '300,310' },
        ],
      },
      {
        id: 320,
        name: '人事',
        parentId: 300,
        parentName: '行政与合规',
        sort: 2,
        containParent: '300',
        children: [
          { id: 321, name: '入职材料', parentId: 320, parentName: '人事', sort: 1, containParent: '300,320' },
          { id: 322, name: '请假与加班', parentId: 320, parentName: '人事', sort: 2, containParent: '300,320' },
          { id: 323, name: '绩效评估', parentId: 320, parentName: '人事', sort: 3, containParent: '300,320' },
        ],
      },
      {
        id: 330,
        name: '安全合规',
        parentId: 300,
        parentName: '行政与合规',
        sort: 3,
        containParent: '300',
        children: [
          { id: 331, name: '等保资料', parentId: 330, parentName: '安全合规', sort: 1, containParent: '300,330' },
          { id: 332, name: '渗透测试报告', parentId: 330, parentName: '安全合规', sort: 2, containParent: '300,330' },
          { id: 333, name: '隐私条款', parentId: 330, parentName: '安全合规', sort: 3, containParent: '300,330' },
        ],
      },
    ],
  },
  {
    id: 400,
    name: '归档',
    parentId: 0,
    parentName: '',
    sort: 4,
    containParent: '',
    children: [
      {
        id: 410,
        name: '历史版本',
        parentId: 400,
        parentName: '归档',
        sort: 1,
        containParent: '400',
        children: [
          { id: 411, name: 'V1.0', parentId: 410, parentName: '历史版本', sort: 1, containParent: '400,410' },
          { id: 412, name: 'V1.1', parentId: 410, parentName: '历史版本', sort: 2, containParent: '400,410' },
          { id: 413, name: 'V2.0', parentId: 410, parentName: '历史版本', sort: 3, containParent: '400,410' },
        ],
      },
    ],
  },
]

export const categoryList3 = markDisabledLevels(categoryList2, [1, 2], 'children')
console.log(categoryList3, 'categoryList3')
