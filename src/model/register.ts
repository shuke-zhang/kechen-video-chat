export interface registerFormModel {
  /**
   * 手机号
   */
  phone: string
  /**
   * 密码
   */
  password: string
  /**
   * 确认密码-前端专用
   */
  newPasswordTwo?: string
  /**
   * 验证码
   */
  code: string
}
