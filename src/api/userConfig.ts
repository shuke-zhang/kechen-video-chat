import type { UserConfigModel } from '@/model/userConfig'

/**
 * @description 分页查询个人设置表列表
 */
export function getUserConfigList(data?: ListPageQuery<UserConfigModel>) {
  return request.post<ResponseListData<UserConfigModel[]>>({
    url: '/api/userConfig/list',
    data,
  })
}

/**
 * @description 修改个人设置
 */
export function putUserConfig(data?: UserConfigModel) {
  return request.post({
    url: '/api/userConfig/update',
    data,
  })
}
