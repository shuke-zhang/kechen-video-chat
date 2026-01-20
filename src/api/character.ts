import type { CharacterModel } from '@/model/character'

/**
 * @description 分页查询角色列表
 */
export function getCharacterList(data?: ListPageQuery<CharacterModel>) {
  return request.post<ResponseListData<CharacterModel[]>>({
    url: '/api/projectCharacter/list',
    data,
  })
}

/**
 * @description 根据id获取角色详细信息
 */
export function getCharacterInfo(id: number) {
  return request.post({
    url: `/api/projectCharacter/${id}`,
  })
}

/**
 * @description 新增角色
 */
export function addCharacter(data: CharacterModel) {
  return request.post({
    url: '/api/projectCharacter/add',
    data,
  })
}
/**
 * @description 修改角色
 */
export function putCharacter(data: CharacterModel) {
  return request.post({
    url: '/api/projectCharacter/update',
    data,
  })
}
/**
 * @description 删除角色
 */
export function delCharacter(idList: number[]) {
  return request.delete({
    url: `/api/projectCharacter/delete`,
    data: idList,
  })
}
