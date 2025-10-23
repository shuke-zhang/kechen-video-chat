/**
 * 用户实体
 */
export interface UserModel {
  /**
   * 创建时间 (ISO 格式)
   * @example "2025-09-17T02:19:21.323Z"
   */
  createdTime?: string

  /**
   * 创建人 ID
   * @example 0
   */
  createdUserId?: number

  /**
   * 创建人姓名
   * @example "string"
   */
  createdUserName?: string

  /**
   * 历史部门信息
   * @example "string"
   */
  departHis?: string

  /**
   * 部门名称
   * @example "string"
   */
  departName?: string

  /**
   * 用户唯一标识 ID
   * @example 0
   */
  id?: number

  /**
   * 用户名
   * @example "string"
   */
  name?: string

  /**
   * 用户密码（建议后端加密存储）
   * @example "string"
   */
  password?: string

  /**
   * 性别描述
   * @example "string"
   */
  sexDesc?: string

  /**
   * 更新时间 (ISO 格式)
   * @example "2025-09-17T02:19:21.323Z"
   */
  updatedTime?: string
}

export interface LoginParams {
  name: string
  password: string
}
