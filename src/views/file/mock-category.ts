// src/api/mock-category.ts
// ✅ 级联分类假数据（与你的 Cascader 用法兼容）

export interface CategoryModel {
  id: number
  name: string
  children?: CategoryModel[]
  disabled?: boolean
}

const categoryTree: CategoryModel[] = [
  {
    id: 100,
    name: '项目资料',
    children: [
      {
        id: 110,
        name: '需求文档',
        children: [
          { id: 111, name: 'PRD' },
          { id: 112, name: '评审记录' },
          { id: 113, name: '原型稿' },
        ],
      },
      {
        id: 120,
        name: '设计资源',
        children: [
          { id: 121, name: 'UI 组件库' },
          { id: 122, name: '图标集' },
          { id: 123, name: '品牌规范' },
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
        ],
      },
      {
        id: 220,
        name: '音频',
        children: [
          { id: 221, name: '配乐' },
          { id: 222, name: '音效库' },
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
        ],
      },
    ],
  },
]

interface Resp<T> {
  data: T
}

export async function getCategoryTree(): Promise<Resp<CategoryModel[]>> {
  await waitMs(200)
  return {
    data: categoryTree,
  }
}

function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
