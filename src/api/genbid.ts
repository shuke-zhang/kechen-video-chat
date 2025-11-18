import type { GenbidModel } from '@/model/genbid'

/**
 * @description 分页查询生成表-键列表
 */
export function getGenbidList(data?: GenbidModel) {
  return request.post<ResponseListData<GenbidModel[]>>({
    url: '/api/genBid/list',
    data,
  })
}

/**
 * @description 获取生成表详情-键数据
 */
export function getGenbidInfo(id: number) {
  return request.post({
    url: `/api/genBid/${id}`,
  })
}

/**
 * @description 新增生成表-键数据
 */
export function addGenbid(data: GenbidModel) {
  return request.post({
    url: '/api/genBid/add',
    data,
  })
}
/**
 * @description 修改生成表-键数据
 */
export function PutGenbid(data: GenbidModel) {
  return request.post({
    url: '/api/genBid/update',
    data,
  })
}
/**
 * @description 删除生成表-键数据
 */
export function DelGenbid(idList: number[]) {
  return request.delete({
    url: `/api/genBid/delete`,
    data: idList,
  })
}
