import type { VideoGenModel, VideoGenResult } from '@/model/video'

/**
 * @description 视频表生成图片
 */
export function videoGen(data: VideoGenModel[]) {
  return request.post<ResponseData<VideoGenResult[]>>({
    url: '/api/videoMergeRecord/videoGen',
    data,
  })
}

/**
 * @description 视频表生成图片
 */
export function videoMerge(data: VideoGenModel[]) {
  return request.post<ResponseData<string>>({
    url: '/api/videoMergeRecord/videoMerge',
    data,
  })
}
