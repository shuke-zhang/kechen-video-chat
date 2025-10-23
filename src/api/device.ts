import type { DeviceModel } from '@/model/device'

/**
 * @description 分页查询班级列表列表
 */
export function getDeviceList(data?: ListQuery<DeviceModel>) {
  return request.post<ResponseListData<DeviceModel[]>>({
    url: '/api/picoDevice/list',
    data,
  })
}

/**
 * @description 新增数据
 */
export function addDevice(data: ListQuery<DeviceModel>) {
  return request.post({
    url: '/api/picoDevice/add',
    data,
  })
}
/**
 * @description 修改数据
 */
export function PutDevice(data: ListQuery<DeviceModel>) {
  return request.put({
    url: '/api/picoDevice/update',
    data,
  })
}

/**
 * @description 删除字典类型-键数据
 */
export function DelDevice(idList: number[]) {
  return request.delete({
    url: `/api/picoDevice/delete`,
    data: idList,
  })
}
