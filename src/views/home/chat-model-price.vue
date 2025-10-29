<script setup lang="ts">
import type { PropType } from 'vue'

/**
 * special - 红紫渐变
 * normal - 橙黄渐变
 * limited - 粉橙渐变
 */
export type priceTypeModel = 'special' | 'normal' | 'limited'
// const props = defineProps({
//   priceType: {
//     type: String as PropType<priceTypeModel>,
//     default: 'normal',
//   },
// })
const priceType = ref<priceTypeModel>('normal')
const gradientClass = computed(() => {
  switch (priceType.value) {
    case 'special':
      return 'bg-[linear-gradient(135deg,#df062e,#df069e)]'
    case 'normal':
      return 'bg-[linear-gradient(135deg,#ffae00,#ff7200)]'
    case 'limited':
      return 'bg-[linear-gradient(135deg,#ff6e6e,#ff928f)]'
    default:
      return ''
  }
})
function getPriceType(value: number): priceTypeModel {
  const types: priceTypeModel[] = ['special', 'normal', 'limited']
  const idx: number = ((value % 3) + 3) % 3
  return types[idx]
}

function getGradientClass(value: number): string {
  const priceType: priceTypeModel = getPriceType(value)
  switch (priceType) {
    case 'special': return 'bg-[linear-gradient(135deg,#df062e,#df069e)]'
    case 'normal': return 'bg-[linear-gradient(135deg,#ffae00,#ff7200)]'
    case 'limited': return 'bg-[linear-gradient(135deg,#ff6e6e,#ff928f)]'
    default: return ''
  }
}
</script>

<template>
  <div class="mt-[20px] grid gap-[16px] [grid-template-columns:repeat(auto-fit,minmax(288px,1fr))]">
    <div
      v-for="item in 10" :key="item" class="card relative border-0"
    >
      <!-- 角标 -->
      <div class="flex flex-warp mb-[16px] h-20px   text-white text-[12px]">
        <span class=" px-[8px] py-[4px]  rounded-[12px]" :class="getGradientClass(item)">
          编程特惠
        </span>
      </div>

      <div class="pb-[24px] border-b border-b-[rgba(0,0,0,0.08)]">
        <!-- 模型标题 -->
        <h3 class="mb-[12px] text-bold text-[20px] font-bold">
          Claude 编程特惠资源包
        </h3>
        <!-- 副标题 -->
        <p class="mb-[20px] text-[14px] text-[#666]">
          针对 Claude 系列模型的编程特惠，限时上架折扣，欲购从速！！
        </p>
        <!-- 特征 -->
        <div class="text-[12px]">
          <div class="flex gap-[8px]">
            <div class="text-[#10b981]">
              ✓
            </div>
            <div class="text-[#555]">
              Claude 协议
            </div>
          </div>

          <div class="flex gap-[8px]">
            <div class="text-[#10b981]">
              ✓
            </div>
            <div class="text-[#555]">
              Anthropic 协议兼容
            </div>
          </div>

          <div class="flex gap-[8px]">
            <div class="text-[#10b981]">
              ✓
            </div>
            <div class="text-[#555]">
              模型持续追加
            </div>
          </div>
        </div>
      </div>

      <!-- 价格 -->
      <div class="pt-[20px] flex justify-between items-center">
        <div class="text-[#df062e] text-[20px]">
          ¥99
        </div>
        <a class="text-white text-[14px] rounded-[8px] py-[10px] px-[20px]  cursor-pointer" :class="getGradientClass(item)">
          立即购买
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
