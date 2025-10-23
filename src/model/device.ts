/**
 * 设备记录对象。
 * 表示一次记录的完整元数据与标识信息。
 */
export interface DeviceModel {
  /** 创建时间，ISO 8601 字符串，如 "2025-09-18T06:05:24.143Z"。 */
  createdTime?: string
  /** 创建人用户 ID。 */
  createdUserId?: number
  /** 创建人用户名。 */
  createdUserName?: string
  /** 删除标记：0=正常，1=已删除。 */
  delFlag?: 0 | 1
  /** 记录主键 ID。 */
  id?: number
  /** Pico 设备编号或业务编号。 */
  picoNumber?: string
  /** 更新时间，ISO 8601 字符串，如 "2025-09-18T06:05:24.143Z"。 */
  updatedTime?: string
}
