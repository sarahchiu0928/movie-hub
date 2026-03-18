<script setup lang="ts">
import { computed } from 'vue'

defineProps<{
  title: string
  year: string
  duration: string
  rating: number
  genre: string
  isInWatchlist: boolean
  isLoggedIn: boolean
}>()

defineEmits<{
  toggleWatchlist: [event: MouseEvent]
}>()

const primaryGenre = computed(() => {
  return props.genre.split(' / ')[0]
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <span class="px-3 py-1 bg-indigo-600 rounded-md text-[10px] font-black tracking-tighter">PREMIUM</span>
      <span class="text-slate-400 text-sm font-bold">{{ year }} • {{ duration }}</span>
    </div>

    <!-- 標題 + 愛心收藏按鈕 -->
    <div class="flex items-center justify-between gap-4">
      <h1 class="text-5xl md:text-7xl font-black leading-tight drop-shadow-2xl">{{ title }}</h1>
      <button
        v-if="isLoggedIn"
        class="w-12 h-12 rounded-full bg-black/50 border-2 border-white/0 hover:border-white/50 flex items-center justify-center hover:bg-black/70 transition-colors flex-shrink-0"
        @click="$emit('toggleWatchlist', $event)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          :fill="isInWatchlist ? '#f43f5e' : 'none'"
          :stroke="isInWatchlist ? '#f43f5e' : 'white'"
          stroke-width="2"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          />
        </svg>
      </button>
    </div>

    <!-- 評分和類型 -->
    <div class="flex flex-wrap items-center gap-6 pt-2">
      <div class="flex items-center gap-2">
        <div
          class="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="text-yellow-500"
          >
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            />
          </svg>
        </div>
        <div>
          <div class="text-xl font-black leading-none">{{ rating }}</div>
          <div class="text-[9px] text-slate-500 font-black uppercase mt-1">IMDb 評分</div>
        </div>
      </div>
      <div class="h-8 w-px bg-white/10"></div>
      <div class="space-y-0.5">
        <div class="text-lg font-bold text-slate-200">{{ genre }}</div>
        <div class="text-[9px] text-slate-500 font-black uppercase">影片類型</div>
      </div>
    </div>
  </div>
</template>
