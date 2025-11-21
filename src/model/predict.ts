/**
 * 项目清单 / 报价参数表（PredictProject）实体
 * 表示一条“项目清单/报价参数”的记录
 */
export interface PredictModel {
  /** 主键 ID（int32） */
  id?: number

  /** 代码 / 标识 */
  code?: string

  /** 项目名称 - originalName */
  projectName?: string

  /** 清单名称（可为空）列表name */
  bqName?: string

  /** 拦标价 / 控制价 / 最高限价（金额，number） */
  capPrice?: number

  /** 总数（int32） */
  totalCount?: number

  /** 陪标家数 / 陪标数据（int32） */
  companionCount?: number

  /** 陪标单价（number） */
  companionUnitPrice?: number

  /** 陪标系数 */
  companionUnitRate?: number

  /** 其他数（int32） */
  otherCount?: number

  /** 其他家单价 - 开始值（number） */
  otherStart?: number

  /** 其他家系数 */
  otherRate?: number

  /** 其他家单价 - 结束值（number） */
  otherEnd?: number

  /** 其他家单价 - 区间单价 - 迭代值 / 步长（number） */
  otherStep?: number

  /** 删除标志（int32；0=未删，1=已删等，具体以后端约定为准） */
  delFlag?: number

  /** 创建人员 id（int32） */
  createdUserId?: number

  /** 创建人名称 */
  createdUserName?: string

  /** 创建时间（ISO 日期时间字符串） */
  createdTime?: string

  /** 更新时间（ISO 日期时间字符串） */
  updatedTime?: string

  /**
   * 预测时传递给后端
   */
  projectList?: importPredictModel[]
}

export interface ImportFileResponseData<T> {
  /**
   * 当前文件名
   */
  currentName: string
  /**
   * 列表
   */
  tree: T[]
  /**
   * 原始文件名
   */
  originalName: string
}

export interface importPredictModel {
  /** 业务/定额编码（保留前导 0，故使用 string），示例："010401002012" */
  code?: string
  /** 名称，示例："加气混凝土砌块墙" */
  name?: string
  /**
   * 项目特征
   */
  feature?: string
  /**
   * 综合单价
   */
  rate?: string
  /**
   * 综合总价
   */
  total?: string
  /**
   * 拦标价
   */
  topUnitPrice?: string

  /** 父级 ID（后端返回为字符串，保持一致），示例："4" */
  parentId?: string
  children?: importPredictModel[]
}

export interface AddPredictResponse<T> {
  /**
   * 折线图-x数据
   */
  x: string[]
  /**
   * 折线图y数据
   */
  y: string[]
  /**
   * 跳新的标签页-展示列表
   */
  resultData: T[]
}
/**
 * 预测结果模型
 */
export interface AddPredictResponseData {

  id?: number
  /**
   * 编码
   */
  code?: string
  /**
   * 名称
   */
  bqName?: string
  /**
   * 拦标价
   */
  capPrice?: string
  /**
   * 陪标单价
   */
  companionUnitPrice?: string
  /**
   * 陪标系数
   */
  companionUnitRate?: string
  /**
   * 其他家价格
   */
  otherPrice?: string
  /**
   * 其他家系数
   */
  otherRate?: string
  /**
   * 总数
   */
  total?: string
  /**
   * 其他数
   */
  otherCount?: number
  /**
   * 陪标家数
   */
  companionCount?: number
  /**
   * 结果
   */
  resultValue?: string
}
