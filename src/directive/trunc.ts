// src/directives/trunc.ts
import type { App, Directive } from 'vue'

export interface TruncBindingOptions {
  item?: Record<string, unknown>
  key?: string
  titleWhenTruncated?: boolean
  observeResize?: boolean
  observeMutations?: boolean
  lines?: number
  onChange?: (flag: boolean, el: HTMLElement) => void
}

type MeasureFn = () => void

let io: IntersectionObserver | null = null
let ro: ResizeObserver | null = null
let mo: MutationObserver | null = null

const measures = new WeakMap<HTMLElement, MeasureFn>()
const lastFlags = new WeakMap<HTMLElement, boolean>()

function getIO(cb: IntersectionObserverCallback): IntersectionObserver {
  if (io)
    return io
  io = new IntersectionObserver(cb)
  return io
}

function getRO(cb: ResizeObserverCallback): ResizeObserver {
  if (ro)
    return ro
  ro = new ResizeObserver(cb)
  return ro
}

function getMO(cb: MutationCallback): MutationObserver {
  if (mo)
    return mo
  mo = new MutationObserver(cb)
  return mo
}

/** 垂直或水平任一方向溢出即为截断 */
function isTruncated(el: HTMLElement): boolean {
  const vOverflow = el.scrollHeight > el.clientHeight
  const hOverflow = el.scrollWidth > el.clientWidth
  const truncated = vOverflow || hOverflow
  return truncated
}

/** 设置行数限制（可选） */
function applyClamp(el: HTMLElement, lines?: number): void {
  if (!lines)
    return
  el.style.display = '-webkit-box'
  el.style.webkitBoxOrient = 'vertical'
  el.style.overflow = 'hidden'
  el.style.webkitLineClamp = String(lines)
}

/** 写回目标对象的布尔标记或仅触发回调 */
function writeBack(
  el: HTMLElement,
  flag: boolean,
  opts: TruncBindingOptions,
): void {
  const existed = lastFlags.get(el)
  if (existed === flag)
    return
  lastFlags.set(el, flag)
  if (opts.item && opts.key) {
    ; (opts.item as any)[opts.key] = flag
  }
  if (opts.titleWhenTruncated) {
    el.title = flag ? el.textContent ?? '' : ''
  }
  if (opts.onChange) {
    opts.onChange(flag, el)
  }
}

/** 创建并注册测量函数 */
function ensureMeasure(el: HTMLElement, opts: TruncBindingOptions): MeasureFn {
  const measure: MeasureFn = () => {
    requestAnimationFrame(() => {
      const flag = isTruncated(el)
      writeBack(el, flag, opts)
    })
  }
  measures.set(el, measure)
  return measure
}

/** 统一解绑 */
function unwatch(el: HTMLElement): void {
  if (ro) {
    try {
      ro.unobserve(el)
    }
    catch { }
  }
  if (io) {
    try {
      io.unobserve(el)
    }
    catch { }
  }
  if (mo) {
    try {
      mo.disconnect()
    }
    catch { }
  }
  measures.delete(el)
  lastFlags.delete(el)
}

/** 指令主体 */
export const vTrunc: Directive<HTMLElement, TruncBindingOptions | boolean> = {
  mounted(el, binding) {
    const opts: TruncBindingOptions = {}
    const val = binding.value
    if (typeof val === 'boolean') {
      opts.item = undefined
      opts.key = undefined
      opts.titleWhenTruncated = val
      opts.observeResize = true
      opts.observeMutations = true
      opts.lines = undefined
      opts.onChange = undefined
    }
    else {
      opts.item = val?.item
      opts.key = val?.key ?? 'isTextTruncated'
      opts.titleWhenTruncated = val?.titleWhenTruncated ?? false
      opts.observeResize = val?.observeResize ?? true
      opts.observeMutations = val?.observeMutations ?? true
      opts.lines = val?.lines
      opts.onChange = val?.onChange
    }
    applyClamp(el, opts.lines)
    const measure = ensureMeasure(el, opts)
    const onIO: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting)
          return
        measure()
        if (opts.observeResize) {
          getRO(() => measure()).observe(el)
        }
      })
    }
    getIO(onIO).observe(el)
    if (opts.observeMutations) {
      const moCb: MutationCallback = () => {
        measure()
      }
      const observer = getMO(moCb)
      observer.observe(el, { characterData: true, childList: true, subtree: true })
    }
  },
  updated(el, binding) {
    const opts = typeof binding.value === 'boolean' ? { titleWhenTruncated: binding.value } as TruncBindingOptions : binding.value || {}
    const measure = measures.get(el)
    if (!measure)
      return
    applyClamp(el, opts.lines)
    measure()
  },
  unmounted(el) {
    unwatch(el)
  },
}

/** 批量注册（可选导出给 index.ts 使用） */
export function installTrunc(app: App): void {
  app.directive('trunc', vTrunc)
}
