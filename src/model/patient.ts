/**
 * 人员实体
 */
export interface PatientModel {
  /**
   * 地址
   * @example "string"
   */
  address?: string

  /**
   * 创建时间 (ISO 格式)
   * @example "2025-09-17T06:24:11.242Z"
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
   * 职务（可能是岗位描述或其他信息）
   * @example "2025-09-17T06:24:11.242Z"
   */
  duties?: string

  /**
   * 学历（对应数据字典: sys_education）
   * 后端返回的是number，前端用 string 类型接收
   * @example 0
   */
  education?: string

  /**
   * 人员唯一标识 ID
   * @example 0
   */
  id?: number

  /**
   * 身份证号
   * @example "string"
   */
  idCard?: string

  /**
   * 删除标志 (0=未删除, 1=已删除)
   * @example 0
   */
  isDel?: number

  /**
   * 姓名
   * @example "string"
   */
  name?: string

  /**
   * 手机号
   * @example "string"
   */
  phone?: string

  /**
   * 生日 (ISO 格式)
   */
  birthday?: string
  /**
   * 性别（对应数据字典: sys_user_sex）
   * @example "M" 或 "F"
   */
  sex?: string

  /**
   * 更新时间 (ISO 格式)
   * @example "2025-09-17T06:24:11.242Z"
   */
  updatedTime?: string
}
