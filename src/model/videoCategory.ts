export interface VideoCategoryModel {
  id?: number
  name?: string
  createTime?: string
  updateTime?: string
  /**
   * 前端临时使用的日期数组
   */
  dateRange?: string[]
  /**
   * 父级类别id
   */
  parentId?: number
  /**
   * 诊疗项名称
   */
  treatProjectName?: string
  /**
   * 诊疗项id
   */
  treatProjectId?: string

  children?: VideoCategoryModel[]
}
