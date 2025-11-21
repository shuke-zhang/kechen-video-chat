import type { UploadRequestOptions } from 'element-plus'
import type { AddPredictResponseData, ImportFileResponseData, importPredictModel, PredictModel } from '@/model/predict'

/**
 * @description 导入
 */
export function importPredictFile(options: UploadRequestOptions) {
  const formData = new FormData()
  formData.append('file', options.file)
  return request.post<ResponseData<ImportFileResponseData<importPredictModel>>>({
    url: `/api/predict/list/upload`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * @description 分页查询文件-键列表
 */
export function getPredictList(data?: ListPageQuery<PredictModel>) {
  return request.post<ResponseListData<PredictModel[]>>({
    url: '/api/predict/list',
    data,
  })
}

/**
 * @description 根据id获取预测详情
 */
export function getPredictInfo(id: number) {
  return request.post({
    url: `/api/predict/${id}`,
  })
}

/**
 * @description 新增预测-键数据
 */
export function addPredict(data: PredictModel) {
  return request.post<ResponseData<AddPredictResponseData[]>>({
    url: '/api/predict/add',
    data,
  })
}
/**
 * @description 修改预测-键数据
 */
export function PutPredict(data: PredictModel) {
  return request.post({
    url: '/api/predict/update',
    data,
  })
}
/**
 * @description 删除预测-键数据
 */
export function DelPredict(idList: number[]) {
  return request.delete({
    url: `/api/predict/delete`,
    data: idList,
  })
}
