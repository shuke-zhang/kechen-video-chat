export interface VoiceModel {
  /**
   * 主键id
   */
  id?: number
  /**
   * 模型类别
   */
  modelType?: number
  /**
   * 项目id
   */
  projectId?: number
  /**
   * 所属的系统音色
   */
  systemVoice?: number
  /**
   * 测试的语音路径
   */
  testAudio?: string
  /**
   * 音色参数
   */
  voiceArgs?: VoiceArgsModel
  /**
   * 音色ID
   */
  voiceId?: string

  /**
   * 音色名称
   */
  voiceName?: string
  /**
   * 音色状态
   */
  voiceStatus?: number
  /**
   * 音色类别
   */
  voiceType?: string

}

export interface uploadAudioResponse {
  /**
   * 上传成功之后返回的地址
   */
  testAudio?: string
  /**
   * 音色id
   */
  voiceId?: string
}

/**
 * 音色参数
 */
export interface VoiceArgsModel {
  /**
   * 音量高低
   */
  pitch?: number
  /**
   * 效果强度
   */
  strength?: number
  /**
   * 输出质量
   */
  quality?: number
}
