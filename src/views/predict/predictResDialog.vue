<script setup lang="ts">
import type { AddPredictResponseData } from '@/model/predict'

defineProps<{
  list: Array<AddPredictResponseData>
}>()

const visible = defineModel<boolean>('visible', {
  type: Boolean,
  required: true,
})

const submitLoading = ref(false)

function cancel() {
  visible.value = false
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="预测结果"
    width="1200"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-table
      :data="list"
      max-height="400"
      style="width: 100%"
    >
      <el-table-column prop="code" label="编码" align="center" width="90" show-overflow-tooltip />

      <el-table-column prop="bqName" label="名称" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" min-width="120" />

      <el-table-column prop="capPrice" label="拦标价" align="center" show-overflow-tooltip :formatter="$formatterTablePrice" />

      <el-table-column prop="companionUnitPrice" label="陪标单价" align="center" show-overflow-tooltip :formatter="$formatterTablePrice" />

      <el-table-column prop="companionUnitRate" label="陪标系数" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />

      <el-table-column prop="otherPrice" label="其他家价格" align="center" show-overflow-tooltip :formatter="$formatterTablePrice" width="100" />

      <el-table-column prop="otherRate" label="其他家系数" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" width="100" />

      <el-table-column prop="total" label="总数" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />

      <el-table-column prop="otherCount" label="其他数" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />

      <el-table-column prop="companionCount" label="陪标家数" align="center" show-overflow-tooltip :formatter="$formatterTableEmpty" />

      <el-table-column prop="resultValue" label="F值" align="center" :formatter="$formatterTableEmpty" min-width="160">
        <template #default="{ row }">
          <span class="text-[20px] text-green-500">{{ row.resultValue }}</span>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" :loading="submitLoading" @click="cancel">
          确 定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
</style>
