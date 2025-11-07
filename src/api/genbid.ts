import type { GenbidModel } from '@/model/genbid'

/**
 * @description 分页查询文件-键列表
 */
export function getGenbidList(params?: GenbidModel) {
  console.log(params, 'params')

  return request.get<ResponseListData<GenbidModel[]>>({
    url: '/api/genbid/list',
    params,
  })
}

/**
 * @description 新增字典类型-键数据
 */
export function getGenbidInfo(id: number) {
  return request.post({
    url: `/api/genbid/${id}`,
  })
}

/**
 * @description 新增文件-键数据
 */
export function addGenbid(data: GenbidModel) {
  return request.post({
    url: '/api/genbid/add',
    data,
  })
}
/**
 * @description 修改文件-键数据
 */
export function PutGenbid(data: GenbidModel) {
  return request.post({
    url: '/api/genbid/update',
    data,
  })
}
/**
 * @description 删除文件-键数据
 */
export function DelGenbid(idList: number[]) {
  return request.delete({
    url: `/api/genbid/delete`,
    data: idList,
  })
}
