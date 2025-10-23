import type { UserModel } from '@/model/user'

/**
 * @description 分页查询用户列表
 */
export function getUserList(data?: ListPageQuery<UserModel>) {
  return request.post<ResponseListData<UserModel[]>>({
    url: '/api/user/list',
    data,
  })
}

/**
 * @description 根据id获取用户详细信息
 */
export function getUserInfo(id: number) {
  return request.post({
    url: `/api/user/${id}`,
  })
}

/**
 * @description 新增用户
 */
export function addUser(data: UserModel) {
  return request.post({
    url: '/api/user/add',
    data,
  })
}
/**
 * @description 修改用户
 */
export function PutUser(data: UserModel) {
  return request.post({
    url: '/api/user/update',
    data,
  })
}
/**
 * @description 删除用户
 */
export function DelUser(idList: number[]) {
  return request.delete({
    url: `/api/user/delete`,
    data: idList,
  })
}

/**
 * 修改密码
 */
export function putUserPassword(data: { id: number, password: string }) {
  return request.post({
    url: `/api/user/password`,
    data,
  })
}

/**
 * @description 用户注销
 */
export function outUser() {
  return request.get({
    url: `/api/user/loginout`,
    enable401AuthGuard: false,
  })
}
