import type { TimesBidModel } from '@/model/timesBid'

/**
 * @description 分页查询项目次数-键列表
 */
export function getTimesBidList(data?: TimesBidModel) {
  return request.post<ResponseListData<TimesBidModel[]>>({
    url: '/api/timesBid/list',
    data,
  })
}

/**
 * @description 获取项目次数-键数据
 */
export function getTimesBidInfo(id: number) {
  return request.post({
    url: `/api/timesBid/${id}`,
  })
}

/**
 * @description 新增项目次数-键数据
 */
export function addTimesBid(data: TimesBidModel) {
  return request.post({
    url: '/api/timesBid/add',
    data,
  })
}
/**
 * @description 修改项目次数-键数据
 */
export function PutTimesBid(data: TimesBidModel) {
  return request.post({
    url: '/api/timesBid/update',
    data,
  })
}
/**
 * @description 删除项目次数-键数据
 */
export function DelTimesBid(idList: number[]) {
  return request.delete({
    url: `/api/timesBid/delete`,
    data: idList,
  })
}
