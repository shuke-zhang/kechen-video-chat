import type { ProjectModel } from '@/model/project'

/**
 * @description 分页查询文件-键列表
 */
export function getProjectList(data?: ListPageQuery<ProjectModel>) {
  return request.post<ResponseListData<ProjectModel[]>>({
    url: '/api/project/list',
    data,
  })
}

/**
 * @description 新增字典类型-键数据
 */
export function getProjectInfo(id: number) {
  return request.post({
    url: `/api/project/${id}`,
  })
}

/**
 * @description 新增文件-键数据
 */
export function addProject(data: ProjectModel) {
  return request.post({
    url: '/api/project/add',
    data,
  })
}
/**
 * @description 修改文件-键数据
 */
export function PutProject(data: ProjectModel) {
  return request.post({
    url: '/api/project/update',
    data,
  })
}
/**
 * @description 删除文件-键数据
 */
export function DelProject(idList: number[]) {
  return request.delete({
    url: `/api/project/delete`,
    data: idList,
  })
}
