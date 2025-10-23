<script setup lang="ts">
import type { EpPropMergeType } from 'element-plus/es/utils/index.mjs'
import type { PropType } from 'vue'

export type CssTypeModel = EpPropMergeType<StringConstructor, 'primary' | 'success' | 'warning' | 'info' | 'danger', unknown>

const props = defineProps({
  // 数据
  options: {
    type: Array as PropType<
      Partial<
        {
          label: string
          value: string
          dictType: string
          cssType?: CssTypeModel
        }[]
      >
    >,
    default: () => [{}],
  },
  // 当前的值
  value: [Number, String, Array],
  isDefault: Boolean,
})

const isDefault = computed(() => props.isDefault)

const values = computed(() => {
  if (props.value !== null && typeof props.value !== 'undefined') {
    return Array.isArray(props.value) ? props.value : [String(props.value)]
  }
  else {
    return []
  }
})
const matchedOptions = computed(() => {
  return values.value.map(val => props.options?.find(option => option?.value === val) || null)
})
</script>

<template>
  <div>
    <template v-for="(item, index) in matchedOptions!">
      <template v-if="item && values.includes(item.value)">
        <span v-if="isDefault" :key="item?.value" :index="index">
          {{ item?.label }}
        </span>
        <el-tag v-else :key="`${item?.value}`" :disable-transitions="true" :index="index" :type="item?.cssType || 'primary'">
          {{ item?.label }}
        </el-tag>
      </template>
      <span v-else :key="`${item?.value}-`">-</span>
    </template>
  </div>
</template>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
