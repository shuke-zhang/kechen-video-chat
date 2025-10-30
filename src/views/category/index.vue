<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// ✅ 一次性几十个分类，填满页面
const categories = Array.from({ length: 36 }).map((_, i) => {
  const pool = [
    {
      name: '视频合成',
      desc: '基于文本或图像生成高质量视频内容。',
      cover: 'https://picsum.photos/400/300?random=1',
      path: '/video-synthesis',
    },
    {
      name: '音色合成',
      desc: '自定义音色与语调，打造专属 AI 声音。',
      cover: 'https://picsum.photos/400/300?random=2',
      path: '/voice-synthesis',
    },
    {
      name: '图像生成',
      desc: '输入提示词即可生成高分辨率艺术画面。',
      cover: 'https://picsum.photos/400/300?random=3',
      path: '/image-gen',
    },
    {
      name: '人物建模',
      desc: '通过照片生成 3D 人物模型，支持动画驱动。',
      cover: 'https://picsum.photos/400/300?random=4',
      path: '/character-modeling',
    },
    {
      name: '文案生成',
      desc: 'AI 自动生成视频脚本与推广文案。',
      cover: 'https://picsum.photos/400/300?random=5',
      path: '/text-gen',
    },
    {
      name: '素材管理',
      desc: '统一管理上传的图像、音频与模板素材。',
      cover: 'https://picsum.photos/400/300?random=6',
      path: '/assets',
    },
    {
      name: '项目分析',
      desc: '实时监控项目状态与生成数据。',
      cover: 'https://picsum.photos/400/300?random=7',
      path: '/project-analyze',
    },
    {
      name: '任务调度',
      desc: '多任务自动排队处理，提高运行效率。',
      cover: 'https://picsum.photos/400/300?random=8',
      path: '/task-schedule',
    },
    {
      name: '模型训练',
      desc: '上传数据，训练属于你的专属 AI 模型。',
      cover: 'https://picsum.photos/400/300?random=9',
      path: '/model-train',
    },
    {
      name: '音频分离',
      desc: '分离人声与背景音，实现清晰语音。',
      cover: 'https://picsum.photos/400/300?random=10',
      path: '/audio-split',
    },
    {
      name: '图像修复',
      desc: 'AI 自动去除噪点、修复破损图片。',
      cover: 'https://picsum.photos/400/300?random=11',
      path: '/image-fix',
    },
    {
      name: '虚拟人生成',
      desc: '创建属于你的 AI 虚拟角色，可绑定语音与动作。',
      cover: 'https://picsum.photos/400/300?random=12',
      path: '/avatar',
    },
  ]
  return pool[i % pool.length]
})

function openCategory(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="category-page max-w-7xl mx-auto px-6 py-10">
    <div
      class="grid gap-[16px] [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]"
    >
      <div
        v-for="(item, index) in categories"
        :key="index"
        class="group bg-white rounded-2xl shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer border border-slate-100"
        @click="openCategory(item.path)"
      >
        <!-- 封面图 -->
        <div class="relative w-full h-[120px] overflow-hidden">
          <img
            :src="item.cover"
            :alt="item.name"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          >
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70 group-hover:opacity-60 transition"
          />
        </div>

        <!-- 内容 -->
        <div class="p-4">
          <h3
            class="text-lg font-semibold text-slate-800 mb-1 truncate group-hover:text-indigo-600 transition"
          >
            {{ item.name }}
          </h3>
          <p
            class="text-slate-500 text-sm leading-relaxed line-clamp-2 min-h-[40px]"
          >
            {{ item.desc }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
