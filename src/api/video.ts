import type { VideoModel } from '@/model/video'

/**
 * @description 分页查询视频类别列表
 */
export function getVideoList(data?: ListPageQuery<VideoModel>) {
  return request.post<ResponseListData<VideoModel[]>>({
    url: '/api/video/list',
    data,
  })
}

/**
 * @description 新增数据
 */
export function addVideo(data: VideoModel) {
  return request.post({
    url: '/api/video/add',
    data,
  })
}
/**
 * @description 修改数据
 */
export function PutVideo(data: VideoModel) {
  return request.post({
    url: '/api/video/update',
    data,
  })
}
/**
 * @description 删除数据
 */
export function DelVideo(idList: number[]) {
  return request.delete({
    url: `/api/video/delete`,
    data: idList,
  })
}
