import type { VideoGenModel } from '@/model/video'

/**
 * @description 视频表生成图片
 */
export function videoGen(data: VideoGenModel[]) {
  return request.post<ResponseData>({
    url: '/api/videoMergeRecord/videoGen',
    data,
  })
}
