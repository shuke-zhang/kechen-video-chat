import type { CategoryModel } from '@/model/category'

/**
 * @description 分页查询类别-键列表
 */
export function getCategoryList(data?: ListPageQuery<CategoryModel>) {
  return request.post<ResponseListData<CategoryModel[]>>({
    url: '/api/category/list',
    data,
  })
}

/**
 * @description 查询类别树形
 */
export function getCategoryTree(data?: CategoryModel) {
  return request.post<ResponseData<CategoryModel[]>>({
    url: '/api/category/tree',
    data,
  })
}

/**
 * @description 查新类别信息-键数据
 */
export function getCategoryInfo(id: number) {
  return request.post({
    url: `/api/category/${id}`,
  })
}

/**
 * @description 新增类别-键数据
 */
export function addCategory(data: CategoryModel) {
  return request.post({
    url: '/api/category/add',
    data,
  })
}
/**
 * @description 修改类别-键数据
 */
export function PutCategory(data: CategoryModel) {
  return request.post({
    url: '/api/category/update',
    data,
  })
}
/**
 * @description 删除类别-键数据
 */
export function DelCategory(idList: number[]) {
  return request.delete({
    url: `/api/category/delete`,
    data: idList,
  })
}
