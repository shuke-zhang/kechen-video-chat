/**
 * 员工管理
 */
export interface EmployeeModel {
  /**
   * id
   */
  id?: number
  /**
   * 创建时间
   */
  createdTime?: string
  /**
   * 创建人员id
   */
  createdUserId?: string
  /**
   * 姓名
   */
  name?: string
  /**
   * 出生日期
   */
  birthday?: string
  /**
   * 证书链接
   */
  certificate?: string
  /**
   * 岗位证书（安全员证、施工员证等）
   */
  certLink?: string
  /**
   * 学历
   */
  education?: string
  /**
   * 性别名称（男/女）
   */
  genderName?: string
  /**
   * 职务
   */
  position?: string
  /**
   * 职务/岗位id
   */
  positionId?: string
  /**
   * 职称（工程师/高级工程师等）
   */
  professionalTitle?: string
  /**
   * 项目经理安全考试合格证（B 证）
   */
  projectSafeCert?: string
  /**
   * 安全员安全考试合格证（C 证）
   */
  safeCert?: string
  /**
   * 开始工作时间
   */
  startWorkDate?: string
  /**
   * 模板链接
   */
  templateLink?: string
  /**
   * 备注
   */
  remark?: string
}
