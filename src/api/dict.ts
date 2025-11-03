import type { DictDataModel, DictModel } from '@/model/dict'

/**
 * @description 分页查询字典类型-键列表
 */
export function getDictList(data?: ListPageQuery<DictModel>) {
  return request.post<ResponseListData<DictModel[]>>({
    url: '/api/sysDict/list',
    data,
  })
}

/**
 * @description 新增字典类型-键数据
 */
export function getDictInfo(id: number) {
  return request.post({
    url: `/api/sysDict/${id}`,
  })
}

/**
 * @description 新增字典类型-键数据
 */
export function addDict(data: DictModel) {
  return request.post({
    url: '/api/sysDict/add',
    data,
  })
}
/**
 * @description 修改字典类型-键数据
 */
export function PutDict(data: DictModel) {
  return request.post({
    url: '/api/sysDict/update',
    data,
  })
}
/**
 * @description 删除字典类型-键数据
 */
export function DelDict(idList: number[]) {
  return request.delete({
    url: `/api/sysDict/delete`,
    data: idList,
  })
}

// **==============================>🗾 字典数据 ✍<==============================**

/**
 * @description 根据dictType查询字典数据
 */
export function getDictDataList(data: ListPageQuery<DictDataModel>) {
  return request.post<ResponseListData<DictDataModel[]>>({
    url: '/api/dictInfo/list',
    data,
  })
}

/**
 * @description 根据dictType查询字典数据
 */
export function getDictDataSelect(params: {
  dictType: string
}) {
  return request.get<ResponseData<DictDataModel[]>>({
    url: '/api/dictInfo/dictType',
    params,
  })
}

/**
 * @description 根据id查询字典类型
 */
export function getDictDataInfo(id: number) {
  return request.post({
    url: `/api/dictInfo/${id}`,
  })
}

/**
 * @description 新增字典类型-键数据
 */
export function addDictData(data: DictModel) {
  return request.post({
    url: '/api/dictInfo/add',
    data,
  })
}
/**
 * @description 修改字典类型-键数据
 */
export function PutDictData(data: DictModel) {
  return request.post({
    url: '/api/dictInfo/update',
    data,
  })
}
/**
 * @description 删除字典类型-键数据
 */
export function DelDictData(idList: number[]) {
  return request.delete({
    url: `/api/dictInfo/delete`,
    data: idList,
  })
}
