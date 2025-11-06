export interface FileModel {
  /**
   * 文件内容 - 富文本
   */
  fileContent?: string
  /**
   * 文件后缀
   */
  fileExt?: string
  /**
   * 文件链接
   */
  fileLink?: string
  /**
   * 文件大小 - M
   */
  fileSize?: string
  /**
   * 文件类别 0-文件 1-内容
   */
  fileType?: 0 | 1
  /**
   * 主键id
   */
  id?: number
  /**
   * 原始文件名称
   */
  name?: string
  /**
   * 新文件名称
   */
  newName?: string
  /**
   * 类别id
   */
  typeId?: number
  /**
   * 类别名称
   */
  typeName?: string
}
