<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface Emits {
  (e: 'update:modelValue', v: number): void
  (e: 'change', v: number): void
}

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    format?: (v: number) => string
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
)

const emit = defineEmits<Emits>()

const trackRef = ref<HTMLDivElement | null>(null)
const dragging = ref(false)

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi)
}

function snapToStep(v: number, step: number, min: number) {
  const snapped = Math.round((v - min) / step) * step + min
  return Number(snapped.toFixed(6))
}

const clampedValue = computed(() => {
  return clamp(props.modelValue, props.min, props.max)
})

/**
 * 渲染百分比固定按 0–100
 * 与 min/max 脱钩，仅负责 UI 百分比
 */
const currentAbsPct = computed(() => {
  const v = clamp(props.modelValue, 0, 100)
  return v
})

function setByClientX(clientX: number) {
  if (!trackRef.value) {
    return
  }
  const rect = trackRef.value.getBoundingClientRect()
  const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
  const rawAbs0to100 = ratio * 100
  const raw = clamp(rawAbs0to100, props.min, props.max)
  const snapped = snapToStep(raw, props.step!, props.min)
  const next = clamp(snapped, props.min, props.max)
  emit('update:modelValue', next)
}

function getMinBoundaryX() {
  if (!trackRef.value) {
    return Number.NEGATIVE_INFINITY
  }
  const rect = trackRef.value.getBoundingClientRect()
  const ratio = clamp(props.min / 100, 0, 1)
  return rect.left + ratio * rect.width
}

function isInLeftDisabledArea(clientX: number) {
  const minX = getMinBoundaryX()
  return clientX < minX
}

function onTrackPointerDown(e: PointerEvent) {
  if (props.disabled) {
    return
  }
  if (isInLeftDisabledArea(e.clientX)) {
    return
  }
  const el = e.currentTarget as HTMLElement
  el.setPointerCapture?.(e.pointerId)
  dragging.value = true
  setByClientX(e.clientX)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerup', onPointerUp, { passive: true })
}

function onThumbPointerDown(e: PointerEvent) {
  if (props.disabled) {
    return
  }
  const el = e.currentTarget as HTMLElement
  el.setPointerCapture?.(e.pointerId)
  dragging.value = true
  setByClientX(e.clientX)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerup', onPointerUp, { passive: true })
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) {
    return
  }
  setByClientX(e.clientX)
}

function onPointerUp() {
  if (!dragging.value) {
    return
  }
  dragging.value = false
  emit('change', clampedValue.value)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}

function onTrackClick(e: MouseEvent) {
  if (props.disabled) {
    return
  }
  if (isInLeftDisabledArea(e.clientX)) {
    return
  }
  setByClientX(e.clientX)
  emit('change', clampedValue.value)
}

function onKeyDown(e: KeyboardEvent) {
  if (props.disabled) {
    return
  }
  const step = props.step ?? 1
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault()
    const next1 = clamp(snapToStep(clampedValue.value + step, step, props.min), props.min, props.max)
    emit('update:modelValue', next1)
    emit('change', next1)
    return
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault()
    const next2 = clamp(snapToStep(clampedValue.value - step, step, props.min), props.min, props.max)
    emit('update:modelValue', next2)
    emit('change', next2)
    return
  }
  if (e.key === 'Home') {
    e.preventDefault()
    emit('update:modelValue', props.min)
    emit('change', props.min)
    return
  }
  if (e.key === 'End') {
    e.preventDefault()
    emit('update:modelValue', props.max)
    emit('change', props.max)
    return
  }
  if (e.key === 'PageUp') {
    e.preventDefault()
    const deltaUp = Math.max(step * 10, (props.max - props.min) * 0.1)
    const next3 = clamp(snapToStep(clampedValue.value + deltaUp, step, props.min), props.min, props.max)
    emit('update:modelValue', next3)
    emit('change', next3)
    return
  }
  if (e.key === 'PageDown') {
    e.preventDefault()
    const deltaDown = Math.max(step * 10, (props.max - props.min) * 0.1)
    const next4 = clamp(snapToStep(clampedValue.value - deltaDown, step, props.min), props.min, props.max)
    emit('update:modelValue', next4)
    emit('change', next4)
  }
}

onMounted(() => {
  if (props.modelValue !== clampedValue.value) {
    emit('update:modelValue', clampedValue.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})

watch(
  () => [props.min, props.max],
  () => {
    if (props.modelValue !== clampedValue.value) {
      emit('update:modelValue', clampedValue.value)
    }
  },
)

const buttonStep = 1

function stepDown() {
  if (props.disabled) {
    return
  }
  const s = props.step ?? 1
  const next = clamp(snapToStep(clampedValue.value - buttonStep, s, props.min), props.min, props.max)
  emit('update:modelValue', next)
  emit('change', next)
}

function stepUp() {
  if (props.disabled) {
    return
  }
  const s = props.step ?? 1
  const next = clamp(snapToStep(clampedValue.value + buttonStep, s, props.min), props.min, props.max)
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <div class="w-full select-none">
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="h-8 w-8 rounded-full border border-slate-300 bg-white shadow-sm hover:shadow active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        :disabled="disabled || clampedValue <= min"
        aria-label="decrease"
        @click="stepDown"
      >
        <svg viewBox="0 0 20 20" class="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M12.707 15.293a1 1 0 0 1-1.414 1.414l-6-6a1 1 0 0 1 0-1.414l6-6a1 1 0 1 1 1.414 1.414L7.414 10z" />
        </svg>
      </button>

      <div class="relative flex-1 h-7">
        <div
          ref="trackRef"
          class="absolute inset-y-0 my-[6px] left-0 right-0 rounded-full overflow-hidden cursor-pointer ring-1 ring-slate-200"
          :class="{ 'opacity-50 cursor-not-allowed': disabled }"
          role="slider"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="clampedValue"
          :aria-disabled="disabled ? 'true' : 'false'"
          tabindex="0"
          style="touch-action: none; user-select: none; background-color: #e2e8f0;"
          @pointerdown="onTrackPointerDown"
          @click.stop="onTrackClick"
          @keydown="onKeyDown"
        >
          <div
            class="absolute left-0 top-0 h-full"
            :style="{ width: `calc(${currentAbsPct}% + 0.5px)`, backgroundColor: '#615fff' }"
          />
        </div>

        <!-- 图一风格拇指 -->
        <div
          class="absolute z-10 rounded-full bg-white border-solid transition-[transform,box-shadow] duration-100"
          :class="[disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing']"
          :style="{
            width: '20px',
            height: '20px',
            top: 'calc(50% - 10px)',
            left: `calc(${currentAbsPct}% - 10px)`,
            border: '3px solid #615fff',
            boxShadow: '0 0 0 4px rgba(97,95,255,0.20), 0 1px 2px rgba(0,0,0,0.20)',
            touchAction: 'none',
          }"
          @pointerdown.stop="onThumbPointerDown"
        />
      </div>

      <button
        type="button"
        class="h-8 w-8 rounded-full border border-slate-300 bg-white shadow-sm hover:shadow active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        :disabled="disabled || clampedValue >= max"
        aria-label="increase"
        @click="stepUp"
      >
        <svg viewBox="0 0 20 20" class="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M7.293 4.707a1 1 0 0 1 1.414-1.414l6 6a1 1 0 0 1 0 1.414l-6 6A1 1 0 1 1 6.293 15.293L12.586 10z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 空样式占位：如需自定义主题可在此覆盖 */
</style>
