<script setup lang="ts">
const props = defineProps({
  placeholder: {
    type: String,
    default: '输入消息...',
  },
})
const fsRef = useTemplateRef('fsRef')
const inputRef = useTemplateRef('inputRef')
const inputValue = defineModel()

const acceptData = computed(() => {
  // '*/*' 表示任意文件
  return 'image/jpeg, image/jpg, image/png, image/gif, .mp3, .mp4, .mpeg, .mpga, .m4a, .wav, .webm'
})

function drop(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  // 如果不是文件直接退出
  if (!e.dataTransfer || e.dataTransfer.files.length === 0)
    return
  const files = e.dataTransfer.files
  const _file = files[0]

  // upFile(file)
}

function selectFile(input: any) {
  const _file = input.target.files[0]
  // upFile(file);
}
function paste(e: ClipboardEvent) {
  const rz = getFileFromClipboard(e)
  if (rz.length > 0) {
    console.log('粘贴的东西', rz)
  }
  // upFile(rz[0])
}
</script>

<template>
  <div
    class="myinputs chat-footer"
    @drop="drop"
    @paste="paste"
  >
    <input
      id="fileInput"
      ref="fsRef"
      type="file"
      class="hidden"
      :accept="acceptData"
      @change="selectFile"
    >

    <el-input
      ref="inputRef"
      v-model:value="inputValue"
      type="textarea"
      :placeholder="placeholder"
      :rows="3"
      :autosize="{ minRows: 3, maxRows: 5 }"
      :theme-overrides="
        {
          border: '0',
          borderHover: '#FFF',
          borderFocus: '#FFF',
          boxShadowFocus: '#FFF' }
      "
    />

    <!-- PC端 -->
    <div class="top-bar">
      <div class="left" />
      <div class="send">
        <icon-font
          name="send"
          style="margin-right: 0px !important"
          class="right"
          width="29px"
          height="19px"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .myinputs {
  display: flex;
  align-items: stretch;
  background: var(--n-color) !important; /* 使用 Naive UI 的颜色变量 */
}
</style>
