<script setup lang="ts">
// ⭐ 关键：声明递归组件
import { computed } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'TopItem',
})

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  basePath: {
    type: String,
    default: '',
  },
  subItem: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()

/** 是否有 children */
const hasChildren = computed(() => {
  return Array.isArray(props.item.children) && props.item.children.length > 0
})

/** 拼接 path（最简路径规范化） */
const fullPath = computed(() => {
  const base = props.basePath || ''
  const route = props.item.path || ''

  const path = `${base}/${route}`.replace(/\/+/g, '/')
  return path.startsWith('/') ? path : `/${path}`
})

/** 点击跳转 */
function handleClick(path: string) {
  router.push(path)
}
</script>

<template>
  <!-- 有 children → 渲染 el-sub-menu -->
  <el-sub-menu
    v-if="hasChildren"
    :index="fullPath"
  >
    <template #title>
      <span class="h-full text-[20px] hover:text-primary flex-center">{{ item.meta?.title }}</span>
    </template>

    <!-- 递归调用自身 -->
    <TopItem
      v-for="child in item.children"
      :key="child.path"
      :item="child"
      :base-path="fullPath"
      :sub-item="true"
    />
  </el-sub-menu>

  <!-- 无 children → 渲染 el-menu-item -->
  <el-menu-item
    v-else
    :index="fullPath"
    @click="handleClick(fullPath)"
  >
    <span class="h-full text-[20px] flex-center" :class="{ 'text-[16px]!': subItem }">{{ item.meta?.title }}</span>
  </el-menu-item>
</template>

<style scoped>

</style>
