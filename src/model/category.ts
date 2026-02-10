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
  /**
   * 是否展示文本标题-仅仅用于前端展示
   * 成语不展示-4
   */
  showTextTitle?: boolean
  /**
   * 是否展示生成角色-仅仅用于前端展示
   * 古诗不展示-3
   */
  showCharacter?: boolean
}
