import type { UploadRequestOptions } from 'element-plus'

/**
 * @description 导入
 */
export function importPredictFile(options: UploadRequestOptions) {
  const formData = new FormData()
  formData.append('file', options.file)
  return request.post<ResponseData<any>>({
    url: `/api/predict/list/upload`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
