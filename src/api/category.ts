import type { CategoryModel } from '@/model/category'

/**
 * @description 分页查询字典类型-键列表
 */
export function getCategoryList(data?: ListPageQuery<CategoryModel>) {
  return request.post<ResponseListData<CategoryModel[]>>({
    url: '/api/category/list',
    data,
  })
}

/**
 * @description 新增字典类型-键数据
 */
export function getCategoryInfo(id: number) {
  return request.post({
    url: `/api/category/${id}`,
  })
}

/**
 * @description 新增字典类型-键数据
 */
export function addCategory(data: CategoryModel) {
  return request.post({
    url: '/api/category/add',
    data,
  })
}
/**
 * @description 修改字典类型-键数据
 */
export function PutCategory(data: CategoryModel) {
  return request.post({
    url: '/api/category/update',
    data,
  })
}
/**
 * @description 删除字典类型-键数据
 */
export function DelCategory(idList: number[]) {
  return request.delete({
    url: `/api/category/delete`,
    data: idList,
  })
}
