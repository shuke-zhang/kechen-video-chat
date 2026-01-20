export interface generateImageModel {
  /**
   * 1-项目
   * 2-人物
   */
  mode?: number
  /**
   * 描述文本
   */
  text?: string
  /**
   * 主题
   * 主要要传递文字如 人物
   */
  topic?: string
}
