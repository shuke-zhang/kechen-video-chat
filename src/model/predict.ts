/**
 * 预测参数模型
 * 用于“树形不分页 + 预测弹窗”表单的数据结构
 */
export interface PredictModel {
  /**
   * id
   */
  id?: number
  /**
   * 总家数（>= 1 的整数）
   * @type {number}
   */
  totalVendors?: number

  /**
   * 拦截价格（>= 0）
   * @type {number}
   */
  interceptPrice?: number

  /**
   * 陪标家数（>= 0 的整数）
   * @type {number}
   */
  companionVendors?: number

  /**
   * 陪标单价（>= 0）
   * @type {number}
   */
  companionUnitPrice?: number

  /**
   * 其他家预测值（数量，>= 0 的整数）
   * @type {number}
   */
  otherVendorsPredicted?: number

  /**
   * 其他家单价（>= 0）
   * @type {number}
   */
  otherVendorsUnitPrice?: number

  /**
   * 单价上限（>= 0）
   * @type {number}
   */
  unitPriceUpper?: number

  /**
   * 单价下限（>= 0，且 <= 上限）
   * @type {number}
   */
  unitPriceLower?: number

  /**
   * 区间值（步长，> 0）
   * @type {number}
   */
  unitPriceInterval?: number
}
