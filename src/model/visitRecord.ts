/**
 * 治疗记录
 */
export interface VisitRecordModel {
  // /** 申请科室名称 */
  // applyDepart?: string

  // /** 申请科室 ID */
  // applyDepartId?: number

  /** 备注信息 */
  comment?: string

  /** 创建时间（ISO 格式） */
  createdTime?: string

  /** 创建人 ID */
  createdUserId?: number

  /** 创建人姓名 */
  createdUserName?: string

  /** 删除标识（0=正常，1=已删除） */
  delFlag?: number

  /** 设备 Pico ID */
  devicePicoId?: number

  /** 诊断内容  自己填 */
  diagnostic?: string

  /** 诊断医生姓名 自己填 */
  diagnosticDoctor?: string

  /** 执行医生姓名 自己填 */
  executeDoctor?: string

  /** 状态（0=未开始 当0有同步按钮，1=进行中 再电玩城，2=已完成 等） */
  status?: number

  /** 治疗科室名称-用户所属科室 */
  treatDepart?: string

  /** 治疗科室 ID */
  treatDepartId?: number

  /** 治疗项目 ID-诊疗项 */
  treatProjectId?: string

  /** 治疗项目名称 name-诊疗项 */
  treatProjectName?: string

  /** 视频方案 ID */
  videoPlanId?: number

  /** 记录唯一 ID */
  id?: number

  /** 患者 ID */
  patientId?: number

  /** 患者姓名 */
  patientName?: string

  /** 视频方案名称 */
  planName?: string

  /** 更新时间（ISO 格式） */
  updatedTime?: string

}
