/**
 * 视频播放计划（VideoPlan）模型。
 * 表示一个视频方案/计划的元数据与关联信息。
 */
export interface VideoPlanModel {
  /** 创建时间，ISO 8601 字符串，如 "2025-09-18T07:40:17.605Z"。 */
  createdTime?: string
  /** 创建人用户 ID。 */
  createdUserId?: number
  /** 创建人用户名。 */
  createdUserName?: string
  /** 删除标记：0=正常，1=已删除。 */
  delFlag?: 0 | 1
  /** 主键 ID。 */
  id?: number
  /** 方案名称。 */
  name?: string
  /** 排序号，数字越小越靠前。 */
  orderNum?: number
  /** 计划类型（业务枚举值，具体取值含义由后端约定）。 */
  planType?: number
  /** 更新时间，ISO 8601 字符串，如 "2025-09-18T07:40:17.605Z"。 */
  updatedTime?: string
  /** 关联的视频 ID。 */
  videoId?: string
  /** 关联的视频名称。 */
  videoName?: string
}
