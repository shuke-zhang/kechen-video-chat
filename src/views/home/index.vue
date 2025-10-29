<script setup lang="ts">
import type { MenuItemRegistered } from 'element-plus'
import ChatModelPrice from './chat-model-price.vue'

const props = defineProps({
  currentSidebarItem: {
    type: Object as PropType<MenuItemRegistered | null>,
    required: false,
    default: null,
  },
})
watch(
  () => props.currentSidebarItem,
  (newVal) => {
    console.log('当前侧边栏选中的菜单项发生变化：', newVal)
    // TODO 根据侧边栏选中的菜单项，执行相应的逻辑
  },
)
</script>

<template>
  <div class="app-container">
    <MarqueeNotice
      text="大大的通知，这个通知非常重要，你要认真认真仔细仔细再仔细的看，就是今天天气怎么样？ ❤️"
      bg-color="bg-green-500"
      :speed="1"
    />

    <h1 class="sub-title mt-[20px] text-2xl font-bold text-slate-800">
      软件简介
    </h1>

    <section
      class="max-w-6xl mx-auto mt-6 bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-2xl shadow-xl p-10 flex flex-col md:flex-row items-start gap-10"
    >
      <!-- 左侧：软件简介 -->
      <div class="flex-1 text-left">
        <h2 class="text-3xl font-bold text-slate-800 mb-3">
          AI 智能视频生成平台
        </h2>
        <p class="text-lg text-slate-500 mb-6 tracking-wide">
          重新定义创作边界 · 一键生成 · 灵感无限
        </p>

        <p class="text-base text-slate-600 leading-7 mb-8">
          本平台致力于将 AI 的创造力与视频艺术结合，通过强大的多模态模型，
          让创意不再受限。用户可通过网页端即可完成视频合成、音色生成与素材管理，
          无需安装客户端，即开即用。
        </p>

        <div class="flex gap-4">
          <button
            class="bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            立即体验
          </button>
          <button
            class="border border-indigo-600 text-indigo-600 font-medium px-6 py-2.5 rounded-lg hover:bg-indigo-50 transition"
          >
            查看示例
          </button>
        </div>
      </div>

      <!-- 右侧：功能入口 -->
      <div
        class="flex-1 grid sm:grid-cols-2 gap-5 text-left"
      >
        <!-- 功能卡片 1 -->
        <div
          class="cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 group"
        >
          <div class="flex items-center mb-3">
            <div
              class="w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-xl mr-3 group-hover:bg-indigo-600 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.8"
                stroke="currentColor"
                class="w-6 h-6 text-indigo-600 group-hover:text-white transition"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 10.5V6.75A1.5 1.5 0 0014.25 5.25H4.5A1.5 1.5 0 003 6.75v10.5A1.5 1.5 0 004.5 18.75h9.75a1.5 1.5 0 001.5-1.5V13.5l4.5 4.5V6l-4.5 4.5z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-800">
              视频合成
            </h3>
          </div>
          <p class="text-slate-500 text-sm leading-relaxed">
            输入文字、图像或音频，AI 自动生成流畅的成片效果。
          </p>
        </div>

        <!-- 功能卡片 2 -->
        <div
          class="cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 group"
        >
          <div class="flex items-center mb-3">
            <div
              class="w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-xl mr-3 group-hover:bg-indigo-600 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.8"
                stroke="currentColor"
                class="w-6 h-6 text-indigo-600 group-hover:text-white transition"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 18.75a6 6 0 006-6v-3a6 6 0 00-12 0v3a6 6 0 006 6z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-800">
              音色合成
            </h3>
          </div>
          <p class="text-slate-500 text-sm leading-relaxed">
            模拟自然语音情感，支持多语言、多语调生成。
          </p>
        </div>

        <!-- 功能卡片 3 -->
        <div
          class="cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 group"
        >
          <div class="flex items-center mb-3">
            <div
              class="w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-xl mr-3 group-hover:bg-indigo-600 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.8"
                stroke="currentColor"
                class="w-6 h-6 text-indigo-600 group-hover:text-white transition"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.5 6.75A2.25 2.25 0 016.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v10.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 17.25V6.75z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-800">
              素材管理
            </h3>
          </div>
          <p class="text-slate-500 text-sm leading-relaxed">
            云端存储与资源调度，高效管理模型素材与模板。
          </p>
        </div>

        <!-- 功能卡片 4 -->
        <div
          class="cursor-pointer bg-white rounded-2xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 group"
        >
          <div class="flex items-center mb-3">
            <div
              class="w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-xl mr-3 group-hover:bg-indigo-600 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.8"
                stroke="currentColor"
                class="w-6 h-6 text-indigo-600 group-hover:text-white transition"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.385.764.78.93l.845.364c.527.227.746.85.495 1.36l-.49.98a1.125 1.125 0 00.273 1.305l.734.734c.39.39.39 1.024 0 1.414l-.734.734a1.125 1.125 0 00-.273 1.305l.49.98c.251.51.032 1.133-.495 1.36l-.845.364a1.125 1.125 0 00-.78.93l-.149.894c-.09.542-.56.94-1.11.94h-1.093c-.55 0-1.02-.398-1.11-.94l-.149-.894a1.125 1.125 0 00-.78-.93l-.845-.364c-.527-.227-.746-.85-.495-1.36l.49-.98a1.125 1.125 0 00-.273-1.305l-.734-.734a1.125 1.125 0 010-1.414l.734-.734c.39-.39.39-1.024 0-1.414l-.734-.734a1.125 1.125 0 00-.273-1.305l-.49-.98c-.251-.51-.032-1.133.495-1.36l.845-.364c.395-.166.71-.506.78-.93l.149-.894z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-800">
              个人设置
            </h3>
          </div>
          <p class="text-slate-500 text-sm leading-relaxed">
            自定义模型偏好、账户管理与安全设置。
          </p>
        </div>
      </div>
    </section>

    <!-- 模型价格 -->
    <h1 class="sub-title mt-[20px]">
      模型价格
    </h1>
    <ChatModelPrice />
  </div>
</template>

<style scoped lang="scss">
.sub-title {
  position: relative;
  padding-left: 10px;
  font-size: 24px;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%); /* 垂直居中 */
    height: 30px;
    width: 4px;
    border-radius: 8px;
    background-color: global.$color-system-primary;
  }
}
</style>
