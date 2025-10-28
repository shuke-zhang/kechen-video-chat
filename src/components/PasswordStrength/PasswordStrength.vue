<script setup lang="ts">
import { computed, watch } from 'vue'
/**
 * 低：长度 < 8，或 仅一种字符类型（纯数字 / 纯字母 / 纯特殊）
 * 中：长度 ≥ 8，且恰好两种类型（如：字母+数字 / 字母+特殊 / 数字+特殊）
 * 强：长度 ≥ 8，且同时包含三种类型（数字 + 字母 + 特殊字符）
 */
defineOptions({ name: 'PasswordStrength' })
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'on-change', val: number): void
}>()

interface Props {
  password?: string
  minLength?: number
  /**
   * 特殊字符正则（默认含常见符号和“￥/￥/！”等中文全角）
   */
  specialCharPattern?: RegExp
}

const strength = computed<number>(() => {
  const pwd = props.password ?? ''
  if (!pwd) {
    return 0
  }
  const minLen = props.minLength ?? 8
  if (pwd.length < minLen) {
    return 1
  }
  const num = /\d/
  const letter = /[a-z]/i
  const special = props.specialCharPattern ?? /[@#￥!^&*()_+\-=[\]{};':"\\|,.<>/?`~]/u

  let score = 0
  if (num.test(pwd)) {
    score += 1
  }
  if (letter.test(pwd)) {
    score += 1
  }
  if (special.test(pwd)) {
    score += 1
  }
  if (score <= 1) {
    return 1
  }
  if (score === 2) {
    return 2
  }
  return 3
})

watch(
  strength,
  (val) => {
    emit('on-change', val)
  },
  { immediate: true },
)
</script>

<template>
  <div class="password-strength">
    <div class="password-strength-tip">
      <!-- 如需文案，放开下面示例 -->
      <!-- 密码强度：<b>{{ strength === 3 ? '高' : strength === 2 ? '中' : strength === 1 ? '低' : '无' }}</b> -->
      <!-- <span v-show="strength === 2">（推荐）</span> -->
    </div>
    <ul class="password-strength-bar">
      <li :class="{ active: strength >= 1 }" class="flex justify-center" />
      <li :class="{ active: strength >= 2 }" class="flex justify-center" />
      <li :class="{ active: strength === 3 }" class="flex justify-center" />
    </ul>
  </div>
</template>

<style scoped lang="scss">
.password-strength {
  width: 100%;
  height: 30px;
  .password-strength-tip {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 12px;
    span {
      color: #666;
    }
  }
  .password-strength-bar {
    display: flex;
    li {
      flex: 1;
      height: 8px;
      border-radius: 4px;
      background-color: #c0c4cc;
      & + li {
        margin-left: 2px;
      }

      &:first-child.active {
        background: #ff0000;
      } // 第1个且active
      &:nth-child(2).active {
        background: #ff7200;
      } // 第2个且active
      &:last-child.active {
        background: #3fd662;
      } // 最后一个且active
    }
  }
}
</style>
