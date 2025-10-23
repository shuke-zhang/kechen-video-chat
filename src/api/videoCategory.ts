import type { VideoCategoryModel } from '@/model/videoCategory'

/**
 * @description 分页查询视频类别列表
 */
export function getVideoCategoryList(data?: ListPageQuery<VideoCategoryModel>) {
  return request.post<ResponseListData<VideoCategoryModel[]>>({
    url: '/api/videoType/list',
    data,
  })
}

/**
 * @description 查询视频类别树形结构
 */
export function getVideoCategoryTree(params?: VideoCategoryModel) {
  return request.get<ResponseData<VideoCategoryModel[]>>({
    url: '/api/videoType/tree',
    params,
  })
}

/**
 * @description 新增数据
 */
export function addVideoCategory(data: VideoCategoryModel) {
  return request.post({
    url: '/api/videoType/add',
    data,
  })
}
/**
 * @description 修改数据
 */
export function PutVideoCategory(data: VideoCategoryModel) {
  return request.post({
    url: '/api/videoType/update',
    data,
  })
}
/**
 * @description 删除数据
 */
export function DelVideoCategory(idList: number[]) {
  // 将数组转换为多个 `idList` 查询参数
  const queryString = idList.map(id => `idList=${id}`).join('&')

  return request.delete({
    url: `/api/videoType/delete`,
    data: idList,
  })
}
