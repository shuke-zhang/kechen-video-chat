import type { CacheTime } from './cache'

import type { LoginFormModel } from '@/model/login'
import type { UserModel } from '@/model/user'
import { name, version } from '../../../package.json'
import { Cache } from './cache'

interface CacheType {
  /**
   * 登录凭证
   */
  TOKEN: string
  /**
   * 登录用户密码
   */
  LOGIN_INFO: LoginFormModel
  /**
   * 是否登录
   */
  IS_LOGGED_IN: boolean
  /**
   * 用户信息
   */
  USER_INFO: UserModel
}
/**
 * 缓存
 */
const cache = new Cache<CacheType>(name, version)

/** */
export function getCacheToken() {
  return cache.get('TOKEN')
}

export function setCacheToken(token: string) {
  console.log('设置缓存TOKEN', token)

  return cache.set('TOKEN', token, -1)
}

export function removeCacheToken() {
  return cache.remove('TOKEN')
}

/**
 * 限制 T 必须是 CacheType[keyof CacheType] 中的某一种
 */
/**
 * 通用 getCache，要求传入的 T 类型必须是 CacheType[keyof CacheType] 的某种
 * 同时传入 key 限制为 CacheType 的 key，确保类型一致
 */
export function getCache<K extends CacheType[keyof CacheType]>(
  key: string,
) {
  return cache.get<K>(key)
}
/**
 * 通用缓存方案 - set
 * @param key 缓存的键
 * @param value 缓存的值
 * @param expires 缓存的过期时间
 */
export function setCache<K extends keyof CacheType>(
  key: K,
  value: CacheType[K],
  expires?: number | Partial<CacheTime>,
) {
  return cache.set(key, value, expires)
}
/** 通用缓存方案 - remove */
export function removeCache(key: keyof CacheType) {
  return cache.remove(key)
}

export * from './local'
