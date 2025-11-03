export interface CategoryModel {
  /**
   * 分类名称
   */
  name: string
  id: number
  /**
   * 路径 - 用于前端路由
   */
  path?: string
}
