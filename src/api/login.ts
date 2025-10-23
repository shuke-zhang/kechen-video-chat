import type { LoginParams, UserModel } from '@/model/user'

export function loginApi(params: LoginParams) {
  return request.get<{
    code: string
    data: string
    msg: string
  }>({
    url: '/api/user/login',
    params,
    withToken: false,
  })
}
/** 获取用户详细信息 */
export function getUserInfo() {
  return request.get<ResponseData<UserModel>>({
    url: '/api/user/info',
  })
}
