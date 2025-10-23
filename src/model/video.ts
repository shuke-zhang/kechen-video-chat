/**
 * 视频实体数据模型
 */
export interface VideoModel {
  /**
   * 视频地址
   */
  address?: string

  /**
   * 备注信息
   */
  comment?: string

  /**
   * 视频封面链接
   */
  coverLink?: string

  /**
   * 创建时间 (ISO 时间字符串)
   * @example "2025-09-16T05:22:10.172Z"
   */
  createdTime?: string

  /**
   * 创建用户ID
   */
  createdUserId?: number

  /**
   * 创建用户名称
   */
  createdUserName?: string

  /**
   * 删除标记 (0=未删除, 1=已删除)
   */
  delFlag?: number

  /**
   * 文件类型 (0=未知, 其它值根据业务定义)
   */
  fileType?: string

  /**
   * 视频ID
   */
  id?: number

  /**
   * 视频名称
   */
  name?: string

  /**
   * 更新时间 (ISO 时间字符串)
   * @example "2025-09-16T05:22:10.172Z"
   */
  updatedTime?: string

  /**
   * 视频时长
   * @example
   */
  videoLength?: string

  /**
   * 视频类型 id
   */
  videoType?: number

  /**
   * 视频类型名称
   */
  videoTypeName?: string
  /**
   * 表示是否是删除时选中状态
   */
  isDelChecked?: boolean
}
