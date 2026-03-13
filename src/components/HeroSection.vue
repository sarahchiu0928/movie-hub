<script setup lang="ts">
import type { Movie } from '../types/movies'

defineProps<{
  movie: Movie
}>()

const emit = defineEmits<{
  viewDetail: []
}>()
</script>

<template>
  <section class="relative h-[85vh] w-full overflow-hidden">
    <!-- 背景大圖 -->
    <div class="absolute inset-0">
      <img :src="movie.backdrop" :alt="movie.title"
        class="w-full h-full object-cover animate-in fade-in zoom-in duration-1000" />
      <!-- 漸層遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent"></div>
    </div>

    <div class="absolute bottom-24 left-6 md:left-12 max-w-2xl space-y-6">
      <div class="flex items-center gap-2 text-indigo-400 font-bold tracking-wider text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
        <span>今日熱門榜單第一名</span>
      </div>
      <h2 class="text-5xl md:text-7xl font-black leading-tight drop-shadow-2xl">
        {{ movie.title }}
      </h2>
      <div class="flex items-center gap-4 text-sm font-semibold text-slate-300">
        <span class="flex items-center gap-1 bg-white/10 px-2 py-1 rounded backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="text-yellow-400">
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {{ movie.rating }}
        </span>
        <span>{{ movie.year }}</span>
        <span>{{ movie.duration }}</span>
        <span class="border border-white/30 px-2 py-0.5 rounded text-[10px]">4K Ultra HD</span>
      </div>
      <p class="text-slate-300 text-lg leading-relaxed line-clamp-3">
        {{ movie.description }}
      </p>

      <div class="flex items-center gap-4 pt-4">
        <button
          class="flex items-center gap-2 bg-white text-slate-950 px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-50 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          立即播放
        </button>
        <button @click="emit('viewDetail')"
          class="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          更多資訊
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
