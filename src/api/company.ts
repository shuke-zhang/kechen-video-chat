import type { CompanyModel } from '@/model/company'

/**
 * @description 分页查询公司信息表-键列表
 */
export function getCompanyList(data?: ListPageQuery<CompanyModel>) {
  return request.post<ResponseListData<CompanyModel[]>>({
    url: '/api/review/company/list',
    data,
  })
}

/**
 * @description 查询公司信息-键数据
 */
export function getCompanyInfo(id: number) {
  return request.post({
    url: `/api/review/company/${id}`,
  })
}

/**
 * @description 查询公司信息
 */
export function getCompanySelectOne() {
  return request.get<ResponseData<CompanyModel>>({
    url: '/api/review/company/selectOne',
  })
}

/**
 * @description 公司信息-键数据
 */
export function addCompany(data: CompanyModel) {
  return request.post({
    url: '/api/review/company/add',
    data,
  })
}
/**
 * @description 修改公司信息-键数据
 */
export function PutCompany(data: CompanyModel) {
  return request.post({
    url: '/api/review/company/update',
    data,
  })
}
/**
 * @description 删除公司信息-键数据
 */
export function DelCompany(idList: number[]) {
  return request.delete({
    url: `/api/review/company/delete`,
    data: idList,
  })
}
