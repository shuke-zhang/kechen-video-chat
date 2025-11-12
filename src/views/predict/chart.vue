<script setup lang="ts">
import type { PropType } from 'vue'
import * as echarts from 'echarts'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  chartData: {
    type: Object as PropType<{
      x: string[]
      y: string[]
      data: string[]
    }>,
    required: true,
  },
})

const visible = defineModel<boolean>('visible', {
  type: Boolean,
  required: true,
})
const chartData = computed(() => props.chartData)
const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null
let ro: ResizeObserver | null = null

function initChart() {
  if (!chartRef.value)
    return
  if (chart)
    return
  chart = echarts.init(chartRef.value)
  const option: echarts.EChartsOption = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.value.x,
    },
    yAxis: {
      type: 'category',
      data: chartData.value.y,
      inverse: false,
      boundaryGap: false,
    },
    grid: {
      left: 40,
      right: 20,
      top: 20,
      bottom: 30,
      containLabel: true,
    },
    series: [
      {
        type: 'line',
        data: chartData.value.data,
        areaStyle: {},
        smooth: true,
        showSymbol: false,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  }
  chart.setOption(option)
  chart.resize()
  ro = new ResizeObserver(() => {
    chart?.resize()
  })
  ro.observe(chartRef.value)
}

function disposeChart() {
  try {
    ro?.disconnect()
  }
  catch {}
  ro = null
  if (chart) {
    chart.dispose()
    chart = null
  }
}

function ensureChartInDialog() {
  nextTick(() => {
    initChart()
  })
}

function cancel() {
  visible.value = false
}

watch(
  () => visible.value,
  (v) => {
    if (v)
      ensureChartInDialog()
    else disposeChart()
  },
)

onMounted(() => {
  if (visible.value)
    ensureChartInDialog()
})

onBeforeUnmount(() => {
  disposeChart()
})
</script>

<template>
  <el-dialog
    v-model="visible"
    title="趋势图"
    width="800"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <div
      ref="chartRef"
      style="width: 100%; height: 420px;"
    />
  </el-dialog>
</template>

<style scoped lang="scss">
</style>
