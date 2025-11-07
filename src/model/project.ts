export interface ProjectModel {
  /**
   * 项目名称
   */
  projectName?: string
  /**
   * 项目建设地址 - 文本域
   */
  projectAddress?: string
  /**
   * 工程概况 - 文本域
   */
  projectDesc?: string
  /**
   * 项目工期 - 天
   */
  projectDuration?: number
  /**
   * 生成的次数
   */
  genTimes?: number
  /**
   * 生成的ids
   */
  genIds?: number
  /**
   * 计划开日期
   */
  projectStartTime?: string
  /**
   * 计划结束日期
   */
  projectEndTime?: string
  /**
   * 工期要求 - 文本域
   */
  projectRequire?: string
  /**
   * 工期承诺 - 文本域
   */
  projectCommit?: string
  /**
   * 安全要求 - 文本域
   */
  safeRequire?: string
  /**
   * 安全承诺 - 文本域
   */
  safeCommit?: string

  /**
   * 类别所选id - 多选 - 只需要传树形结构的子类别
   */
  typeList?: string[]

  /**
   * 主键
   */
  id?: number
  /**
   * 质量要求
   */
  qualityRequire?: string
  /**
   * 质量承诺
   */
  qualityCommit?: string
}
