export interface CharacterModel {
  /**
   * 主键id
   */
  id?: number
  /**
   * 角色名称
   */
  characterName?: string
  /**
   * 角色描述
   */
  description?: string
  /**
   * 角色海报图片链接
   */
  posterUrl?: string
  /**
   * 项目id
   */
  projectId?: number
  /**
   *角色声音ID
   */
  voiceId?: number
  /**
   * 角色声音名称
   */
  voiceName?: string
}
