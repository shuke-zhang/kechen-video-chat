import type { VideoPlanModel } from '@/model/videoPlan'

/**
 * @description 分页查询视频方案列表
 */
export function getVideoPlanList(data?: ListPageQuery<VideoPlanModel>) {
  return request.post<ResponseListData<VideoPlanModel[]>>({
    url: '/api/videoPlan/list',
    data,
  })
}

/**
 * @description 根据id获取视频方案详细信息
 */
export function getVideoPlanInfo(id: number) {
  return request.post({
    url: `/api/videoPlan/${id}`,
  })
}

/**
 * @description 新增视频方案
 */
export function addVideoPlan(data: VideoPlanModel) {
  return request.post({
    url: '/api/videoPlan/add',
    data,
  })
}
/**
 * @description 修改视频方案
 */
export function putVideoPlan(data: VideoPlanModel) {
  return request.post({
    url: '/api/videoPlan/update',
    data,
  })
}
/**
 * @description 删除视频方案
 */
export function DelVideoPlan(idList: number[]) {
  return request.delete({
    url: `/api/videoPlan/delete`,
    data: idList,
  })
}
