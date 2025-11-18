import type { FileModel } from '@/model/file'

/**
 * @description 分页查询文件-键列表
 */
export function getFileList(data?: ListPageQuery<FileModel>) {
  return request.post<ResponseListData<FileModel[]>>({
    url: '/api/file/list',
    data,
  })
}

/**
 * @description 查询文件信息-键数据
 */
export function getCategoryInfo(id: number) {
  return request.post({
    url: `/api/file/${id}`,
  })
}

/**
 * @description 新增文件-键数据
 */
export function addFile(data: FileModel) {
  return request.post({
    url: '/api/file/add',
    data,
  })
}
/**
 * @description 修改文件-键数据
 */
export function PutFile(data: FileModel) {
  return request.post({
    url: '/api/file/update',
    data,
  })
}
/**
 * @description 删除文件-键数据
 */
export function DelFile(idList: number[]) {
  return request.delete({
    url: `/api/file/delete`,
    data: idList,
  })
}
