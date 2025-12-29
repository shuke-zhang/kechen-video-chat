export interface VideoProjectModel {
  /** 分类 ID；用于对项目进行分组，例如 0 表示未分组 */
  categoryId?: string
  /** 封面图片地址；建议使用绝对 URL */
  coverUrl?: string
  /** 创建时间（ISO 字符串） */
  createdTime?: string
  /** 创建者用户 ID */
  createdUserId?: number
  /** 创建者用户名或昵称 */
  createdUserName?: string
  /** 删除标记；0=正常，1=已删除（以你的后端约定为准） */
  delFlag?: number
  /** 项目描述文案（可多行） */
  projectDesc?: string
  /** 项目主键 ID */
  id?: number
  /** 项目名称 */
  projectName?: string
  /** 最近更新时间（ISO 字符串） */
  updatedTime?: string
}
