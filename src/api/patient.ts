import type { PatientModel } from '@/model/patient'
import type { UserModel } from '@/model/user'

/**
 * @description 分页查询患者列表
 */
export function getPatientList(data?: ListPageQuery<PatientModel>) {
  return request.post<ResponseListData<PatientModel[]>>({
    url: '/api/patient/list',
    data,
  })
}

/**
 * @description 根据id获取患者详细信息
 */
export function getPatientInfo(id: number) {
  return request.post({
    url: `/api/patient/${id}`,
  })
}

/**
 * @description 新增患者
 */
export function addPatient(data: PatientModel) {
  return request.post({
    url: '/api/patient/add',
    data,
  })
}
/**
 * @description 修改患者
 */
export function PutPatient(data: PatientModel) {
  return request.post({
    url: '/api/patient/update',
    data,
  })
}
/**
 * @description 删除患者
 */
export function DelPatient(idList: number[]) {
  return request.delete({
    url: `/api/patient/delete`,
    data: idList,
  })
}
