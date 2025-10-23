import type { formatDefaultDate, formatterTableEmpty, GetSelectData, selectDictLabels } from '@/utils'

declare module 'vue' {
  export interface ComponentCustomProperties {

    /**
     * @description 格式化数据，为空时输出 - 表格直接使用 ， 不需要插槽
     * :formatter="formatterTableEmpty"
     */
    $formatterTableEmpty: formatterTableEmpty
    /**
     * @description 传入时间 返回格式化后的默认时间 默认为 YYYY-MM-DD hh:mm:ss
     * @param  date 传入日期
     * @param  format 传入日期格式
     */
    $formatDefaultDate: formatDefaultDate
    /**
     * @description 回显字典数据
     * @param datas 字典数组通常以 useDict 来获取
     * @param value 字典id 可以是单个字符串也可以是数组
     * @param value 分隔符 默认的分隔符","
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
    $selectDictLabels: selectDictLabels

    /**
     * 传入数组、值返回对应的label
     * 可选传入value字段、label字段名称和控制是否返回整个对象的值
     * @example 传入数组、value值 返回list中第一项所对应的 label 值
     * @example 传入数组、value值和options，其中options.value代表value的字段名称，options.label代表label的字段名称 返回list中第一项所对应的 label 值
     * @example 传入数组、value值和isAll  返回list中第一项所对应的一项
     * @example 传入数组、value值和isAll和 options 其中options.value代表value的字段名称，options.label代表label的字段名称 返回list中第一项所对应的一项
     */
    $getSelectData: GetSelectData
    $env: string
  }
}
