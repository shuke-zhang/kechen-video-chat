import type { AsrSetting, SysConfigInfo, TtsSetting } from '@/model/chat'

/**
 *  初始化AI模型
 */
export function emptyAiModel() {
  return {
    // from api
    modelId: 'default',
    modelName: '',
    modelTitle: '',
    modelPlatform: '',
    enable: false,
    isFree: false,
    inputTypes: 'text',

    // for NSelector
    value: '',
    key: '',
    label: '',
    disabled: false,
  }
}

export function emptyAsrSetting(): AsrSetting {
  return {
    model_name: '', // ASR model name
    platform: '', // ASR platform, eg: local or remote
    max_record_duration: 60, // Maximum recording duration in seconds
    max_file_size: 10 * 1024 * 1024, // Maximum file
  }
}

export function emptyTtsSetting(): TtsSetting {
  return {
    synthesizer_side: 'client', // client | server
    model_name: '', // TTS model name
    platform: '', // TTS platform, eg: local or remote
  }
}

export function emptySysConfigInfo(): SysConfigInfo {
  return {
    asrSetting: emptyAsrSetting(),
    ttsSetting: emptyTtsSetting(),
  }
}
