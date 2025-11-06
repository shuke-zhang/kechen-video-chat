export interface CategoryModel {
  /**
   * 主键id
   */
  id?: number
  /**
   * 类别名称
   */
  name?: string
  /**
   * 父级id
   */
  parentId?: number
  /**
   * 所属父级名称
   */
  parentName?: string
  /**
   * 序号
   */
  sort?: number
  /**
   * 全部父级id这个也需要传递
   */
  containParent?: string
}
