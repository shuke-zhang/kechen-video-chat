import type { UploadRow } from '@/model/upload'

// 根据 limit 推导出 v-model 类型
export type UploadedFilesModel<T extends number | undefined>
  = T extends 1 ? UploadRow | null : UploadRow[] | null

/**
 * 上传模式
 *  - 'avatar' → 头像模式（单文件、固定圆形/方形容器、通常只显示最后一张图）
 *  - 'list'   → 列表模式（可多文件，显示缩略图列表）
 *  - 'drag'   → 拖拽模式，支持拖拽，没有预览情况
 *  - 'button' → 按钮模式，只有一个上传按钮，没有预览情况
 */
export type UploadFileModel = 'avatar' | 'list' | 'drag' | 'button'

export interface UploadFileResponseModel {
  /**
   * 字节大小
   */
  // size: number
  /**
   * 文件名
   */
  // public_name: string
  /**
   * 原本的文件名
   */
  original_name: string
  /**
   * 封面图
   */
  // coverPath: string
  /**
   * 地址
   */
  accessPath: string

  // wang
  /**
   * 当前文件名
   */
  currentName: string
  /**
   * 描述
   */
  duration: string
  /**
   * 文件类型
   */
  fileExtension: string

  /**
   * 原始文件名
   */
  originalName: string
}
