<script setup lang='ts'>
import dayjs from 'dayjs'

/** 也可以删掉这段，用你项目里已有的定义 */
// interface FileUploaded {
//   uuid: string
//   url: string
// }

const emit = defineEmits<{
  (e: 'recorded', audioUrl: string, audioBlob: Blob, audioDuration: number): void
  (e: 'submitted', uuid: string, url: string, audioDuration: number): void
  (e: 'exit'): void
}>()

/** ================== UI/状态 ================== */
const audioUrl = ref('')
const recording = ref(false)
const submitting = ref(false)
const errorMsg = ref('')
const recordingDuration = ref(0) // ms

/** ================== 录音配置 ================== */
const MEDIA_TYPE = 'audio/wav'
const CHANNELS = 1
const BUFFER_SIZE = 4096 // 4096/2048/1024 皆可
const TARGET_SAMPLE_RATE = 16000 // 固定 16k；若不想固定可设为 0

/** ================== WebAudio 句柄 ================== */
let stream: MediaStream | null = null
let audioCtx: AudioContext | null = null
let sourceNode: MediaStreamAudioSourceNode | null = null
let processorNode: ScriptProcessorNode | null = null

/** 收集的 PCM 分片（Float32）与最终 Blob */
const pcmChunks: Float32Array[] = []
const recordedBlob = ref<Blob | null>(null)

/** =============== 录音控制 =============== */
async function startRecording() {
  errorMsg.value = ''
  if (!navigator.mediaDevices?.getUserMedia) {
    errorMsg.value = '浏览器不支持音频录制'
    return
  }

  try {
    // 重置
    recordingDuration.value = 0
    audioUrl.value = ''
    recordedBlob.value = null
    pcmChunks.length = 0

    // 申请麦克风
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // 建 AudioContext（尝试固定采样率；部分浏览器可能忽略）
    audioCtx = new AudioContext(
      TARGET_SAMPLE_RATE ? { sampleRate: TARGET_SAMPLE_RATE } : undefined,
    )

    // Mic -> ScriptProcessor -> destination
    sourceNode = audioCtx.createMediaStreamSource(stream)
    processorNode = audioCtx.createScriptProcessor(BUFFER_SIZE, CHANNELS, CHANNELS)

    processorNode.onaudioprocess = (e: AudioProcessingEvent) => {
      const input = e.inputBuffer.getChannelData(0)
      // 拷贝一份，避免复用的内存被后续覆盖
      pcmChunks.push(new Float32Array(input))
    }

    sourceNode.connect(processorNode)
    processorNode.connect(audioCtx.destination) // 不连也行，连上可确保处理活跃

    recording.value = true
    tickDuration()
  }
  catch (err: any) {
    console.error('startRecording error', err)
    errorMsg.value
      = err?.message?.includes('Permission denied')
        ? '获取录音设备失败，请检查浏览器权限设置'
        : err?.message?.includes('Requested device not found')
          ? '没有找到录音设备，请检查设备连接'
          : err?.message || '获取录音设备失败，请检查浏览器权限设置'
    await safeCleanup()
  }
}

function tickDuration() {
  if (!recording.value)
    return
  recordingDuration.value += 200
  setTimeout(tickDuration, 200)
}

async function stopRecording() {
  if (!recording.value)
    return
  recording.value = false

  try {
    // 断开/关闭
    if (processorNode) {
      processorNode.disconnect()
      processorNode.onaudioprocess = null
      processorNode = null as any
    }
    if (sourceNode) {
      sourceNode.disconnect()
      sourceNode = null as any
    }

    // 拿到实际采样率（若浏览器忽略了期望值，则会是输入设备的原始值）
    const srcRate = audioCtx?.sampleRate || TARGET_SAMPLE_RATE || 44100

    if (audioCtx) {
      await audioCtx.close()
      audioCtx = null
    }
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      stream = null
    }

    // 合并 PCM，并按需要重采样
    const merged = mergeFloat32(pcmChunks)
    const samples
      = TARGET_SAMPLE_RATE && srcRate !== TARGET_SAMPLE_RATE
        ? resampleFloat32(merged, srcRate, TARGET_SAMPLE_RATE)
        : merged
    const sampleRate = TARGET_SAMPLE_RATE || srcRate

    // 封装为 WAV(16-bit PCM)
    const wav = encodeWAV(samples, sampleRate, CHANNELS)
    recordedBlob.value = wav
    audioUrl.value = URL.createObjectURL(wav)

    emit('recorded', audioUrl.value, wav, recordingDuration.value / 1000)
  }
  catch (err) {
    console.error(err)
    await safeCleanup()
  }
}

/** =============== 提交上传 =============== */
async function submit() {
  if (!recordedBlob.value) {
    showMessageError('没有录音可上传')
    return
  }
  if (submitting.value) {
    showMessageWarning('正在上传，请稍候')
    return
  }
  try {
    submitting.value = true
    const _file = new File(
      [recordedBlob.value],
      `record_${dayjs().format('YYYYMMDDHHmmss')}.wav`,
      { type: MEDIA_TYPE, lastModified: Date.now() },
    )
    // 上传音频
    // const resp = await api.fileUpload<FileUploaded>(file)
    // if (resp.success) {
    //   emit('submitted', resp.data.uuid, resp.data.url, recordingDuration.value / 1000)
    // }
    // else {
    //  showMessageError('上传音频失败')
    // }
  }
  catch {
    showMessageError('上传音频失败')
  }
  finally {
    submitting.value = false
  }
}

/** =============== 退出/切换 =============== */
async function exit() {
  if (submitting.value) {
    showMessageWarning('正在上传，请稍候')
    return
  }
  audioUrl.value = ''
  recording.value = false
  recordedBlob.value = null
  pcmChunks.length = 0
  await safeCleanup()
  emit('exit')
}

function toggleRecording() {
  if (!navigator.mediaDevices?.getUserMedia) {
    showMessageError('浏览器不支持音频录制')
    return
  }
  if (submitting.value) {
    showMessageWarning('正在上传，请稍候')
    return
  }
  if (recording.value)
    void stopRecording()
  else void startRecording()
}

onBeforeUnmount(async () => {
  await safeCleanup()
  if (audioUrl.value)
    URL.revokeObjectURL(audioUrl.value)
})

/** =============== 清理工具 =============== */
async function safeCleanup() {
  try {
    if (processorNode) {
      processorNode.disconnect()
      processorNode.onaudioprocess = null
      processorNode = null as any
    }
    if (sourceNode) {
      sourceNode.disconnect()
      sourceNode = null as any
    }
    if (audioCtx) {
      await audioCtx.close()
      audioCtx = null
    }
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      stream = null
    }
  }
  catch { /* ignore */ }
}

/** =============== PCM/WAV 工具函数 =============== */
function mergeFloat32(chunks: Float32Array[]): Float32Array {
  let len = 0
  for (const c of chunks) len += c.length
  const out = new Float32Array(len)
  let offset = 0
  for (const c of chunks) {
    out.set(c, offset)
    offset += c.length
  }
  return out
}

/** 简单的线性插值重采样；如需更高音质可替换为更优算法 */
function resampleFloat32(input: Float32Array, srcRate: number, dstRate: number): Float32Array {
  if (srcRate === dstRate)
    return input
  const ratio = srcRate / dstRate
  const dstLen = Math.round(input.length / ratio)
  const output = new Float32Array(dstLen)
  for (let i = 0; i < dstLen; i++) {
    const idx = i * ratio
    const i0 = Math.floor(idx)
    const i1 = Math.min(i0 + 1, input.length - 1)
    const t = idx - i0
    output[i] = (1 - t) * input[i0] + t * input[i1]
  }
  return output
}

/** 封装 WAV（RIFF/WAVE，16-bit PCM，小端） */
function encodeWAV(samples: Float32Array, sampleRate: number, numChannels: number): Blob {
  const bytesPerSample = 2
  const blockAlign = numChannels * bytesPerSample
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample)
  const view = new DataView(buffer)

  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + samples.length * bytesPerSample, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true) // PCM 子块大小
  view.setUint16(20, 1, true) // PCM 格式
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 16, true) // 位宽 16-bit
  writeString(view, 36, 'data')
  view.setUint32(40, samples.length * bytesPerSample, true)

  floatTo16BitPCM(view, 44, samples)
  return new Blob([view], { type: MEDIA_TYPE })
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
}

function floatTo16BitPCM(view: DataView, offset: number, input: Float32Array) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]))
    s = s < 0 ? s * 0x8000 : s * 0x7FFF
    view.setInt16(offset, s, true)
  }
}
</script>

<template>
  <div class="flex flex-col items-center space-y-2">
    <icon-font
      v-if="!recording"
      class="text-6xl cursor-pointer custom-hover"
      name="play"
      @click="toggleRecording"
    />
    <icon-font
      v-else
      class="text-6xl cursor-pointer custom-hover"
      name="sound"
      @click="toggleRecording"
    />
    <div v-if="!recording" class="text-sm text-gray-500">
      点击开始对话
    </div>
    <div v-else class="text-sm text-gray-500">
      对话中({{ (recordingDuration / 1000).toFixed(1) }}秒)，点击图标结束
    </div>

    <div v-if="errorMsg" class="text-sm text-red-500">
      {{ errorMsg }}
    </div>

    <div v-if="audioUrl" class="py-2">
      <audio :src="audioUrl" controls />
    </div>

    <div v-if="!recording" class="flex items-center space-x-2 mt-4 justify-items-end">
      <el-button class="mt-2" :loading="submitting" :disabled="submitting" @click="exit">
        取消
      </el-button>
      <el-button
        v-if="audioUrl"
        class="mt-2"
        :loading="submitting"
        :disabled="!audioUrl || submitting"
        @click="submit"
      >
        发送
      </el-button>
    </div>
  </div>
</template>

<style lang='less' scoped>
.custom-hover:hover {
  color: #7fe7c4;
}
</style>
