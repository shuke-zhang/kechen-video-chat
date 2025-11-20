import type { EmployeeModel } from '@/model/employee'

/**
 * @description 分页查询员工表-键列表
 */
export function getEmployeeList(data?: ListPageQuery<EmployeeModel>) {
  return request.post<ResponseListData<EmployeeModel[]>>({
    url: '/api/review/employee/list',
    data,
  })
}

/**
 * @description 查询员工-键数据
 */
export function getEmployeeInfo(id: number) {
  return request.post({
    url: `/api/review/employee/${id}`,
  })
}

/**
 * @description 员工-键数据
 */
export function addEmployee(data: EmployeeModel) {
  return request.post({
    url: '/api/review/employee/add',
    data,
  })
}

/**
 * @description 修改员工-键数据
 */
export function PutEmployee(data: EmployeeModel) {
  return request.post({
    url: '/api/review/employee/update',
    data,
  })
}
/**
 * @description 删除员工-键数据
 */
export function DelEmployee(idList: number[]) {
  return request.delete({
    url: `/api/review/employee/delete`,
    data: idList,
  })
}
