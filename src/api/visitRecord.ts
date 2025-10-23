import type { VisitRecordModel } from '@/model/visitRecord'

/**
 * @description 分页查询治疗记录列表
 */
export function getVideoTreatList(data?: ListPageQuery<VisitRecordModel>) {
  return request.post<ResponseListData<VisitRecordModel[]>>({
    url: '/api/videoTreat/list',
    data,
  })
}

/**
 * @description 新增治疗记录
 */
export function addVideoTreat(data: VisitRecordModel) {
  return request.post({
    url: '/api/videoTreat/add',
    data,
  })
}
/**
 * @description 修改治疗记录
 */
export function PutVideoTreat(data: VisitRecordModel) {
  return request.post({
    url: '/api/videoTreat/update',
    data,
  })
}
/**
 * @description 删除治疗记录
 */
export function DelVideoTreat(idList: number[]) {
  return request.delete({
    url: `/api/videoTreat/delete`,
    data: idList,
  })
}
