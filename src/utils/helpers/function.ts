/**
 * @description 判断元素文本是否溢出（被截断）
 * @param el 需要检测的 DOM 元素
 * @returns {boolean} true 表示文本被截断，false 表示完全可见
 */
export function isTextTruncated(el: HTMLElement | null): boolean {
  if (!el)
    return false
  return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth
}

export function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    // 安全上下文且支持 clipboard API
    return navigator.clipboard.writeText(text)
      .then(() => {
        ElMessage.success('已复制到剪贴板')
      })
      .catch(() => {
        ElMessage.error('复制失败，请手动复制')
      })
  }
  else {
    // 兜底方案：execCommand（虽然弃用，但兼容性最好）
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (ok) {
        ElMessage.success('已复制到剪贴板')
      }
      else {
        throw new Error('execCommand 复制失败')
      }
    }
    catch (_e) {
      ElMessage.error('复制失败，请手动复制')
    }
  }
}
