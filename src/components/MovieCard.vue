<script setup lang="ts">
import type { Movie } from '../types/movies'

defineProps<{
  movie: Movie
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <div class="group relative cursor-pointer" @click="emit('select')">
    <div
      class="aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-white/5 transition-all duration-300 group-hover:scale-105 group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/10">
      <img :src="movie.poster" :alt="movie.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy" />
      <!-- Hover 遮罩 -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <button
          class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white"
            stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="translate-x-0.5">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
      </div>
    </div>

    <div class="mt-4 space-y-1">
      <h4 class="font-bold text-slate-100 truncate group-hover:text-indigo-400 transition-colors">
        {{ movie.title }}
      </h4>
      <div class="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>{{ movie.year }} • {{ movie.genre.split(' / ')[0] }}</span>
        <div class="flex items-center gap-1 text-indigo-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
            fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {{ movie.rating }}
        </div>
      </div>
    </div>
  </div>
</template>
