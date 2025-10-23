import type { DictDataCssModel } from '@/model/dict'

import { ref, toRefs } from 'vue'

import { getDictDataSelect } from '@/api/dict'

const dictStore = useDictStore() // 缓存 store 调用

/**
 * 获取字典数据
 * @param args 字典类型数组
 * @returns 字典数据
 * @example  const { sys_sex } = useDict('sys_sex');
 * @example  const { card_status, charge_type, charge_way } = useDict('card_status', 'charge_type', 'charge_way');
 */
export function useDict(...args: string[]) {
  //   const res = ref<DictModel[]>([]); // 使用泛型定义字典类型
  const res = ref<Record<string, DictDataCssModel[]>>({})
  return (() => {
    args.forEach((dictType) => {
      res.value[dictType] = []
      const dicts = dictStore.getDict(dictType)
      if (dicts) {
        res.value[dictType] = dicts
      }
      else {
        getDictDataSelect({ dictType }).then((response) => {
          // 筛选出数据键值已经停用的数据
          if (!response.data)
            return
          const data = response.data.filter(el => el.status === '0')

          const list = data.map((el) => {
            return {
              label: el.dictLabel!,
              value: el.dictValue!,
              dictType,
            }
          })
          res.value[dictType] = list || []
          dictStore.setDict(dictType, list || [])
        })
      }
    })
    return toRefs(res.value)
  })()
}
