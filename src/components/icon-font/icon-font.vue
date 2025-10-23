<!-- IconFont.vue -->
<script setup lang="ts">
import type { CSSProperties, PropType } from 'vue'
import { computed } from 'vue'
// 如果你有类型枚举就沿用；没有也可用 string
type IconFontType = string

type HoverStyle
  = | string // 仅传颜色，如 '#16a34a' / 'rgb(0,200,0)'
    | CSSProperties

const props = defineProps({
  /**
   * icon名称
   */
  name: { type: String as PropType<IconFontType>, required: true },
  /**
   * 自定义类名
   */
  className: { type: String, default: '' },
  /**
   * 默认色（非 hover）
   */
  color: { type: String, default: '' }, // 默认色（非 hover）
  /**
   * 尺寸 px 默认16
   */
  size: { type: [String, Number], default: 16 },
  /**
   * hover 的 style
   * - string 默认为hover的颜色
   * - Object<CSSProperties> 动态style
   * @example hover-style="#16a34a"
   * @example :hover-style="{
            color: '#16a34a',
            scale: 1.2,
            rotate: '45deg',
          }"
   */
  hoverStyle: { type: [String, Object] as PropType<HoverStyle>, default: null },
})

const iconName = computed(() => `#icon-${props.name}`)
const svgClass = computed(() => (props.className ? `icon-font ${props.className}` : 'icon-font'))
const px = (v: string | number) => (typeof v === 'number' ? `${v}px` : /^\d+$/.test(v) ? `${v}px` : `${v}`)

const normalizedHover = computed(() => {
  if (!props.hoverStyle)
    return { has: false }
  if (typeof props.hoverStyle === 'string') {
    return { has: true, color: props.hoverStyle }
  }
  const rot = props.hoverStyle.rotate
  const rotate = rot == null ? undefined : (typeof rot === 'number' ? `${rot}deg` : rot)
  return {
    has: true,
    color: props.hoverStyle.color,
    scale: props.hoverStyle.scale,
    rotate,
  }
})

const styleVars = computed(() => {
  const s: Record<string, string> = {
    width: px(props.size),
    height: px(props.size),
  }
  if (props.color)
    s['--icon-base-color'] = props.color
  if (normalizedHover.value.color)
    s['--icon-hover-color'] = normalizedHover.value.color as string
  if (normalizedHover.value.scale)
    s['--icon-hover-scale'] = String(normalizedHover.value.scale)
  if (normalizedHover.value.rotate)
    s['--icon-hover-rotate'] = normalizedHover.value.rotate as string
  return s
})
</script>

<template>
  <svg
    :class="svgClass"
    aria-hidden="true"
    :style="styleVars"
    :data-has-hover="normalizedHover.has ? 'true' : 'false'"
  >
    <!-- 关键：让图标跟随 color 渲染 -->
    <use :href="iconName" fill="currentColor" />
  </svg>
</template>

<style scoped lang="scss">
@import './iconfont.css';

.icon-font {
  position: relative;
  vertical-align: -2px;
  /* 默认色：来自变量；未传则继承父级 color */
  color: var(--icon-base-color, currentColor);
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

/* 仅当传了 hoverStyle 才启用 hover 效果 */
.icon-font[data-has-hover='true']:hover {
  color: var(--icon-hover-color, var(--icon-base-color, currentColor));
  transform: scale(var(--icon-hover-scale, 1)) rotate(var(--icon-hover-rotate, 0deg));
}
</style>
