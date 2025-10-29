<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  speed: {
    type: Number,
    default: 10,
  },
  text: {
    type: String,
    required: true,
  },
})
const boxEl = ref<HTMLElement | null>(null)
const textEl = ref<HTMLElement | null>(null)

let position = 0
let textWidth = 0
let boxWidth = 0
let frameId = 0

const paused = ref(false)

function updateSize() {
  if (!textEl.value || !boxEl.value)
    return
  textWidth = textEl.value.offsetWidth
  boxWidth = boxEl.value.offsetWidth
  position = boxWidth
}

function loop() {
  if (!paused.value && textEl.value) {
    position -= props.speed
    textEl.value.style.transform = `translateX(${position}px)`
    if (position < -textWidth) {
      position = boxWidth
    }
  }
  frameId = requestAnimationFrame(loop)
}

onMounted(() => {
  updateSize()
  loop()
  window.addEventListener('resize', updateSize)
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
  window.removeEventListener('resize', updateSize)
})
</script>

<template>
  <div
    ref="boxEl"
    class="marquee-box"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
  >
    <span class="marquee-icon">📢</span>
    <!-- 固定喇叭 -->

    <!-- 滚动文字 -->
    <div ref="textEl" class="marquee-content">
      {{ text }}
    </div>
  </div>
</template>

<style scoped>
.marquee-box {
  position: relative;
  width: 100%;
  height: 48px;
  overflow: hidden;
  background-color: #fffbea;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding-right: 16px;
}

.marquee-icon {
  flex-shrink: 0;
  color: #c05621;
  width: 50px;
  font-size: 18px;
  z-index: 2;
  background-color: #fffbea;
  display: flex;
  justify-content: center;
  align-items: center;
}

.marquee-content {
  position: absolute;
  left: 50px; /* 留出喇叭位置 */
  white-space: nowrap;
  will-change: transform;
  color: #c05621;
  font-size: 16px;
  font-weight: 500;
}
</style>
