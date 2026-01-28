import type { generateImageModel } from '@/model/generateImage'
import type { TextRoleResponse, TextSplitResponse, VideoModel } from '@/model/video'

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

/**
 * @description 图片生成
 */
export function generateImage(params: generateImageModel) {
  return request.get({
    url: `/api/video/imageGen`,
    params,
  })
}

/**
 * @description 视频表生成图片
 */
export function textVideo(data: VideoModel) {
  return request.post<ResponseResult<TextSplitResponse>>({
    url: '/api/video/textSplit',
    data,
    isJsonResponse: true,
  })
}

/**
 * @description 视频表生成图片
 */
export function textRole(data: VideoModel) {
  return request.post<ResponseData<TextRoleResponse>>({
    url: '/api/video/textRole',
    data,
  })
}
