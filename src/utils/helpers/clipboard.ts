/**
 * 从剪贴板事件中读取文件（主要用于粘贴截图 / 粘贴文件）
 *
 * 使用场景：
 * - Ctrl + V 粘贴截图
 * - Ctrl + V 粘贴文件
 *
 * @param event ClipboardEvent 粘贴事件对象
 * @returns File[] 从剪贴板中解析出的文件数组
 */
export function getFileFromClipboard(event: ClipboardEvent): File[] {
  // 用于存放从剪贴板中解析出来的 File 对象
  const files: File[] = []

  // 兼容处理：
  // - 标准浏览器：event.clipboardData
  // - 某些框架封装事件：event.originalEvent.clipboardData
  const clipboardData
    = event.clipboardData || (event as unknown as { originalEvent?: ClipboardEvent }).originalEvent?.clipboardData

  // 如果剪贴板数据不存在，直接返回空数组
  if (!clipboardData) {
    return files
  }

  // clipboardData.items 包含剪贴板中的所有条目（文本 / 图片 / 文件等）
  const { items } = clipboardData
  if (!items || items.length === 0) {
    return files
  }

  // 遍历剪贴板条目
  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    // 只处理两类内容：
    // 1. 图片类型（如 image/png、image/jpeg，常见于截图）
    // 2. 文件类型（kind === 'file'，如复制的文件）
    const isImage = item.type.startsWith('image/')
    const isFile = item.kind === 'file'

    if (!isImage && !isFile) {
      continue
    }

    // 将剪贴板条目转换为 File 对象
    const file = item.getAsFile()

    // getAsFile() 在某些情况下可能返回 null，需要做保护
    if (file) {
      files.push(file)
    }
  }

  // 返回解析出的文件列表（可能为空数组）
  return files
}
