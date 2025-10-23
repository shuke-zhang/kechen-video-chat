/**
 * @description 基础数据类型
 */
declare type ResponseResult<T extends AnyObject = AnyObject> = {
  code: number
  msg: string
  error: string
} & T

/**
 * @description 列表数据 ruoyi 返回的是 rows 和 total 如果是其他格式请自定义
 *              注意！ rows 已经 是个 T[] 类型！
 */
declare interface ResponseList<T> {
  /**
   * 列表总条数
   */
  total: number
  /**
   * 当前页
   */
  current: number
  /**
   * 每页多少条
   */
  size: number
  /**
   * 列表
   */
  records: T
}

/**
 * @description 数据类型在 records 里面
 */
declare type ResponseRecords<T = any> = ResponseResult<{
  records: T[]
}>

/**
 * @description 数据列表类型 列表包含在 data-records 里面
 */
declare type ResponseListData<T = any> = ResponseResult<{
  data: ResponseList<T>
}>
/**
 * @description 数据类型 列表或者数据直接在data里面
 */
declare type ResponseData<T = any> = ResponseResult<{
  data: T
}>

/**
 * @description 基础分页参数 pageNum pageSize
 */
declare interface ListParamsBase {
  pageNum: number
  pageSize: number
  orderByColumn?: string
  isAsc?: string
}

/**
 * @description page 基础分页参数
 */
declare interface ListParamsPageBase {
  page: {
    current: number
    size: number
  }
}

/**
 * @description 分页查询参数：基础参数 + 泛型查询条件（可选）
 */
declare type ListQueryParams<T extends AnyObject = AnyObject>
  = ListParamsBase & T

/**
 * @description 基础分页参数查询
 */
declare type ListParamsWrapper<T extends AnyObject = AnyObject> = ListParamsBase & Partial<T>

/**
 * @description page分页参数查询 可用于定义 queryParams
 */
declare type ListPageParamsWrapper<T extends AnyObject = AnyObject> = ListParamsPageBase & Partial<T>

declare type ListQuery<T extends AnyObject = AnyObject> = ListParamsBase | ListParamsWrapper<T> | Partial<T>

/**
 * @description page分页方式
 */
declare type ListPageQuery<T extends AnyObject = AnyObject> = ListParamsPageBase | ListPageParamsWrapper<T> | Partial<T>
