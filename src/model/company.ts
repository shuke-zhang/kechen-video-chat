export interface CompanyModel {
  /**
   * 创建id
   */
  createdUserId?: string
  /**
   * 创建人名称
   */
  createdUserName?: string

  /**
   * 删除标志
   */
  delFlag?: number

  /**
   * 员工总人数
   */
  employeesTotal?: number

  /**
   * 公司编号
   */
  id?: number

  /**
   * 初级职称人数
   */
  juniorCount?: number

  /**
   * 中级职称人数
   */
  middleCount?: number

  /**
   * 公司名称
   */
  name?: string

  /**
   * 高级职称人数
   */
  seniorCount?: number

  /**
   * 技工人数
   */
  technicianCount?: number

  /**
   * 更新时间
   */
  updatedTime?: string
}
