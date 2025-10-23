import type { TableColumnCtx } from 'element-plus'
import type { DictDataCssModel } from '@/model/dict'
import dayjs from 'dayjs'

/**
 * 直接从element-plus 中复制
 * - PropertyKey对象属性名允许的三种类型：  string number symbol
 */
type DefaultRow = Record<PropertyKey, any>

interface K {
  [key: string]: any
}

/**
 * @description 格式化数据，为空时输出 - 表格直接使用 ， 不需要插槽
 * :formatter="formatterTableEmpty"
 */
export function formatterTableEmpty<T extends DefaultRow>(row: T, column: TableColumnCtx<T>, cellValue: T[keyof T], _index: number): string {
  return cellValue ? String(cellValue) : '-' // 如果值为空则输出 "-"
}

/**
 * @description 传入时间 返回格式化后的默认时间 默认为 YYYY-MM-DD hh:mm:ss
 * @param  date 传入日期
 * @param  format 传入日期格式
 */
export function formatDefaultDate(date: string, format: string = 'YYYY-MM-DD HH:mm:ss') {
  return date ? dayjs(date).format(format) : '-'
}

/**
 * @description 回显字典数据
 * @param datas 字典数组通常以 useDict 来获取
 * @param value 字典id 可以是单个字符串也可以是数组
 * @param separator 分隔符 默认的分隔符","
 *
 * @returns 返回匹配的字典label，多个值用分隔符连接
 *
 * @example
 * // 示例 1: 查找单个字典值对应的label
 * const dictionary = [
 *   { value: 1, label: 'One' },
 *   { value: 2, label: 'Two' },
 *   { value: 3, label: 'Three' }
 * ];
 * const result = selectDictLabels(dictionary, '1');
 * console.log(result); // 输出: "One"
 *
 * @example
 * // 示例 2: 查找多个字典值，使用数组作为输入
 * const result = selectDictLabels(dictionary, ['1', '3']);
 * console.log(result); // 输出: "One,Three"
 *
 * @example
 * // 示例 3: 查找多个字典值，使用逗号分隔的字符串作为输入
 * const result = selectDictLabels(dictionary, '1,2');
 * console.log(result); // 输出: "One,Two"
 *
 * @example
 * // 示例 4: 自定义分隔符
 * const result = selectDictLabels(dictionary, '1|2', '|');
 * console.log(result); // 输出: "One|Two"
 *
 * @example
 * // 示例 5: 查找值时部分匹配不到字典数据
 * const result = selectDictLabels(dictionary, '1,4');
 * console.log(result); // 输出: "One,4"  // 其中 '4' 不在字典中，返回原值
 */
export function selectDictLabels(
  datas: DictDataCssModel[], // 数据字典，包含value和label的对象数组
  value: string | string[], // 可以是字符串或字符串数组
  separator: string = ',', // 默认的分隔符
): string {
  // 如果 value 是 undefined 或为空数组，返回空字符串
  if (value === null || value === undefined || value.length === 0) {
    return '-'
  }

  // 如果 value 是数组，将其转换为字符串，使用逗号分隔
  if (Array.isArray(value)) {
    value = value.join(',')
  }

  const actions: string[] = [] // 用于存储匹配的label结果
  const temp = value.split(separator) // 根据分隔符分割value

  temp.forEach((val) => {
    let match = false

    // 遍历数据字典，查找匹配的value
    datas.some((item) => {
      if (item.value === `${val}`) {
        actions.push(item.label + separator) // 找到匹配的label，添加到actions
        match = true
        return true // 跳出循环
      }
      return false
    })

    // 如果没有匹配项，直接将原始值加入actions
    if (!match) {
      actions.push(val + separator)
    }
  })

  // 返回拼接后的结果，并去掉最后一个分隔符
  return actions.join('').slice(0, -separator.length)
}

/**
 * 传入数组、值返回对应的label，同时支持传入value字段、label字段名称和控制返回整个对象或仅label
 * @example 传入数组、value值 返回list中第一项所对应的 label 值
 * @example 传入数组、value值和options，其中options.value代表value的字段名称，options.label代表label的字段名称 返回list中第一项所对应的 label 值
 * @example 传入数组、value值和isAll  返回list中第一项所对应的一项
 * @example 传入数组、value值和isAll和 options 其中options.value代表value的字段名称，options.label代表label的字段名称 返回list中第一项所对应的一项
 */
export function getSelectData(list: K[], value: string | number): string
export function getSelectData(
  list: K[],
  value: string | number,
  options: {
    value?: string
    label?: string
  }
): string
export function getSelectData<T extends boolean>(list: K[], value: string | number, isFullObject: T): K
export function getSelectData<T extends boolean>(
  list: K[],
  value: string | number,
  isFullObject: T,
  options: {
    value?: string
    label?: string
  }
): K

export function getSelectData<T extends boolean>(
  list: K[],
  value: string | number,
  arg3?: boolean | { value?: string, label?: string },
  arg4?: { value?: string, label?: string },
): T extends true ? K : string {
  const isFullObject = typeof arg3 === 'boolean' ? arg3 : false
  const options = typeof arg3 === 'object' ? arg3 : arg4
  const valueField = options?.value || 'value'
  const labelField = options?.label || 'label'

  const item = list.find(item => item[valueField] === value) || {
    [valueField]: null,
    [labelField]: null,
  }

  if (!item)
    return undefined as any

  return (isFullObject ? item : item[labelField]) as T extends true ? K : string
}
