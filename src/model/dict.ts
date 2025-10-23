export interface DictModel {
  dictType?: string
  dictName?: string
  remark?: string
  dictId?: number
  /**
   * 0-正常 1-停用
   */
  status?: string
  /**
   * 时间-前端判断
   */
  dateRange?: string[]
}

export interface DictDataModel {
  dictType?: string
  dictName?: string
  remark?: string
  dictId?: number
  /**
   * 0-正常 1-停用
   */
  status?: string
  /**
   * 字典编码
   */
  dictCode?: number
  /**
   *  字典类型
   */
  dictLabel?: string
  /**
   * 字典键值
   */
  dictValue?: string
  /**
   * 排序
   */
  dictSort?: number
}

/**
 * 字典查询出的数据结构
 */
export interface DictDataResultModel {
  /**
   *  字典类型
   */
  dictLabel?: string
  /**
   * 字典键值
   */
  dictValue?: string
  /**
   * 字典编码
   */
  dictCode?: number
}

export interface DictDataCssModel {
  label: string
  value: string
  dictType: string
  cssType?: 'success' | 'warning' | 'info' | 'primary' | 'danger'
}
