import type { GetLabelResponse } from '@/model/reviewProject'

/**
 * @description 获取所有选项
 */
export function getReviewProjectLabel() {
  return request.get<ResponseData<GetLabelResponse>>({
    url: '/api/review/reviewProject/getLabel',
  })
}
