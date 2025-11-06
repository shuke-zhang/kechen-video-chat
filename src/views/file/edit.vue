<script setup lang="ts">
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor-next/editor'
import { DomEditor } from '@wangeditor-next/editor'
import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue'
import '@wangeditor-next/editor/dist/css/style.css'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor | undefined>(undefined)
// 内容 HTML
const valueHtml = defineModel({ type: String })

// toolbar & editor 配置
const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: [
    'group-image',
    'group-video',
    'fullScreen',
  ],
}
const editorConfig: Partial<IEditorConfig> = {}

// 模拟 ajax 异步获取内容
onMounted(async () => {
  await nextTick()
})

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null)
    return
  editor.destroy()
})

// 创建回调
function handleCreated(editor: IDomEditor) {
  console.log('handleCreated', editor)
  editorRef.value = editor // 记录 editor 实例
  nextTick(() => {
    const toolbar = DomEditor.getToolbar(editor)
    if (!toolbar)
      return
    const curToolbarConfig = toolbar.getConfig()
    const sss = editor.getMenuConfig('fontSize')
    console.log(sss, '字体大小配置')
    // "fontSize" "fontFamily"
    console.log(curToolbarConfig.toolbarKeys, '当前菜单排序和分组') // 当前菜单排序和分组
  })
}
</script>

<template>
  <div style="border: 1px solid #ccc">
    <Toolbar :editor="editorRef" :default-config="toolbarConfig" mode="default" />

    <Editor
      v-model="valueHtml"
      :default-config="editorConfig"
      mode="default"
      style="height: 160px"
      @on-created="handleCreated"
    />
  </div>
</template>
