import type { AxiosProgressEvent } from 'axios'
import type { uploadAudioResponse, VoiceModel } from '@/model/voice'

/**
 * @description 分页查询音色列表
 */
export function getVoiceList(data?: ListPageQuery<VoiceModel>) {
  return request.post<ResponseListData<VoiceModel[]>>({
    url: '/api/projectVoice/list',
    data,
  })
}

/**
 * @description 根据id获取音色详细信息
 */
export function getVoiceInfo(id: number) {
  return request.post({
    url: `/api/projectVoice/${id}`,
  })
}

/**
 * @description 新增音色
 */
export function addVoice(data: VoiceModel) {
  return request.post({
    url: '/api/projectVoice/add',
    data,
  })
}
/**
 * @description 修改音色
 */
export function putVoice(data: VoiceModel) {
  return request.post({
    url: '/api/projectVoice/update',
    data,
  })
}
/**
 * @description 删除音色
 */
export function delVoice(idList: number[]) {
  return request.delete({
    url: `/api/projectVoice/delete`,
    data: idList,
  })
}

/**
 * @description 上传音色
 */
export function uploadAudio(formData: FormData) {
  return request.post<ResponseData<uploadAudioResponse>>({
    url: `/api/projectVoice/uploadAudio`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
