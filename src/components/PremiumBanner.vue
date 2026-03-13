// 廣告橫幅
<script setup lang="ts">
import type { Movie } from '../types/movies'

defineProps<{
  movies: Movie[]
}>()
</script>

<template>
  <section
    class="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
    <div
      class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-indigo-500/20 transition-all duration-1000">
    </div>
    <div class="flex-1 space-y-4 relative z-10">
      <span class="bg-indigo-600 text-[10px] font-black tracking-widest px-2 py-1 rounded uppercase">Premium
        Access</span>
      <h3 class="text-3xl font-black italic">IMAX 體驗：視覺震撼</h3>
      <p class="text-slate-300 max-w-md">訂閱高級會員,即可解鎖所有 IMAX 比例電影與高動態範圍 (HDR) 串流服務。</p>
      <button
        class="bg-white text-slate-900 font-bold px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all">
        了解更多
      </button>
    </div>
    <div class="flex-shrink-0 relative z-10">
      <div class="flex -space-x-4">
        <div v-for="i in [1, 2, 3]" :key="i"
          class="w-24 h-32 rounded-lg border-2 border-slate-950 overflow-hidden shadow-2xl transform rotate-3 even:rotate-[-3deg] translate-y-2 group-hover:translate-y-0 transition-transform">
          <img :src="movies?.[i]?.poster" class="w-full h-full object-cover" alt="stack" />
        </div>
      </div>
    </div>
  </section>
</template>
