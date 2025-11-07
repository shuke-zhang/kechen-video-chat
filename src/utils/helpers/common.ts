/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params: any) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    const part = `${encodeURIComponent(propName)}=`
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof value[key] !== 'undefined') {
            const params = `${propName}[${key}]`
            const subPart = `${encodeURIComponent(params)}=`
            result += `${subPart + encodeURIComponent(value[key])}&`
          }
        }
      }
      else {
        result += `${part + encodeURIComponent(value)}&`
      }
    }
  }
  return result
}

// 验证是否为blob格式
export function blobValidate(data: File) {
  return data.type !== 'application/json'
}

/**
 * 设置网页标题左上角logo
 */
export function setFavicon(iconUrl: string) {
  if (!iconUrl) {
    console.warn('图标URL为空，保持当前图标不变')
    return
  }

  // 获取当前favicon
  const existingFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement

  // 检查当前favicon是否存在且URL是否相同
  if (existingFavicon) {
    // 解析URL以处理相对路径和绝对路径的比较
    const currentUrl = new URL(existingFavicon.href, window.location.href).href
    const newUrl = new URL(iconUrl, window.location.href).href

    if (currentUrl === newUrl) {
      return
    }

    // URL不同，移除旧图标
    document.head.removeChild(existingFavicon)
  }

  // 创建新的favicon链接元素
  const favicon = document.createElement('link')
  favicon.rel = 'icon'
  favicon.href = iconUrl

  // 添加到文档头部
  document.head.appendChild(favicon)
}

/**
 * 格式化货币数值为人民币格式的字符串，不进行四舍五入。
 * 支持字符串或数字输入，可选择指定小数位数。
 *
 * @param value - 要格式化的数值，可以是数字或字符串类型。
 * @param decimalPlaces - 可选参数，指定小数位数，默认为 2。
 * @returns 格式化后的货币字符串，若值无效则返回 '-'
 */
export function formatCurrency(value: number | string): string
export function formatCurrency(value: number | string, decimalPlaces: number): string
export function formatCurrency(value: number | string, decimalPlaces: number = 2): string {
  // 检查 value 是否为 null、undefined 或非数字，若无效则返回 '-'
  if (value === null || value === undefined || Number.isNaN(Number(value)))
    return '-'

  // 确保 decimalPlaces 为正整数，默认为 2
  const decimalLength = decimalPlaces > 0 ? decimalPlaces : 2

  // 将数值转化为字符串并按小数位截断，避免四舍五入
  const [integerPart, decimalPart = ''] = Number(value).toString().split('.')
  const truncatedDecimal = decimalPart.slice(0, decimalLength).padEnd(decimalLength, '0')

  // 拼接整数部分和截断的小数部分
  const formattedValue = `${integerPart}.${truncatedDecimal}`

  // 使用国际化格式化来添加货币符号和千位分隔符
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: decimalLength,
    maximumFractionDigits: decimalLength,
  }

  // 使用自定义格式化后的数值并确保不四舍五入
  const finalValue = Number(formattedValue).toLocaleString('zh-CN', options)

  // 若值为负数，将 `-¥` 替换为 `¥ -`
  if (Number(value) < 0) {
    return finalValue.replace('-¥', '¥ -')
  }

  return finalValue
}
