import type { VideoProjectModel } from '@/model/videoProject'

/**
 * @description 分页查询字典类型-键列表
 */
export function getVideoProjectList(data?: ListPageQuery<VideoProjectModel>) {
  return request.post<ResponseListData<VideoProjectModel[]>>({
    url: '/api/videoProject/list',
    data,
  })
}

/**
 * @description 获取项目信息-键数据
 */
export function getVideoProjectInfo(id: number) {
  return request.post({
    url: `/api/videoProject/${id}`,
  })
}

/**
 * @description 新增项目-键数据
 */
export function addVideoProject(data: VideoProjectModel) {
  return request.post({
    url: '/api/videoProject/add',
    data,
  })
}
/**
 * @description 修改项目-键数据
 */
export function PutVideoProject(data: VideoProjectModel) {
  return request.post({
    url: '/api/videoProject/update',
    data,
  })
}
/**
 * @description 删除项目-键数据
 */
export function DelVideoProject(idList: number[]) {
  return request.delete({
    url: `/api/videoProject/delete`,
    data: idList,
  })
}
