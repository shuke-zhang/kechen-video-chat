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

/**
 * 价格格式化
 * @param input 待格式化的数值或字符串
 * @param options 配置项
 * @param options.decimals 小数位（默认 2）
 * @param options.thousand 是否启用千分位分隔（默认 true）
 * @param options.trimZeros 是否去除小数尾随 0（默认 true）
 * @param options.unit 单位或货币符号（示例：'¥'、'元'、'USD'；默认空）
 * @param options.unitPosition 单位位置 'prefix' | 'suffix'（默认 'prefix' 对符号更友好）
 * @param options.negativeParen 负数是否用括号表示（默认 false，示例：(1,234.56)）
 * @param options.locale 使用 Intl 时的本地化语言标记（如 'zh-CN'；默认空表示手动格式化）
 * @returns 格式化后的字符串
 */
export function formatPrice(
  input: number | string | null | undefined,
  options: {
    decimals?: number
    thousand?: boolean
    trimZeros?: boolean
    unit?: string
    unitPosition?: 'prefix' | 'suffix'
    negativeParen?: boolean
    locale?: string
  } = {},
): string {
  const {
    decimals = 2,
    thousand = true,
    trimZeros = true,
    unit = '',
    unitPosition = 'prefix',
    negativeParen = false,
    locale,
  } = options
  if (input === null)
    return '--'
  if (input === undefined)
    return '--'
  const num = typeof input === 'string' ? Number(input) : input
  if (!Number.isFinite(num))
    return '--'
  const isNeg = num < 0
  const abs = Math.abs(num)
  if (locale && unit && /^[A-Z]{3}$/i.test(unit)) {
    const nf = new Intl.NumberFormat(locale, { style: 'currency', currency: unit, minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    const out = nf.format(num)
    return out
  }
  const fixed = abs.toFixed(decimals)
  const [intPartRaw, decPartRaw] = fixed.split('.')
  const intPart = thousand ? intPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : intPartRaw
  const decPart = decimals > 0 ? decPartRaw : ''
  const decShown = trimZeros ? decPart.replace(/0+$/, '') : decPart
  const dot = decShown.length > 0 ? '.' : ''
  const core = intPart + (decimals > 0 ? dot + decShown.padEnd(trimZeros ? decShown.length : decimals, '0') : '')
  const withSign = isNeg ? (negativeParen ? `(${core})` : `-${core}`) : core
  if (!unit)
    return withSign
  if (unitPosition === 'suffix')
    return `${withSign}${unit}`
  return `${unit}${withSign}`
}
