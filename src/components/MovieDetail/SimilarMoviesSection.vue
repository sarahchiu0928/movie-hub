<script setup lang="ts">
import type { Movie } from '../../types/movies'

defineProps<{
  movies: Movie[]
  genreTitle: string
}>()

defineEmits<{
  selectMovie: [movie: Movie]
}>()
</script>

<template>
  <div class="mt-32 space-y-10">
    <div class="flex items-center justify-between">
      <h3 class="text-3xl font-black italic flex items-center gap-4">
        更多 <span class="text-indigo-500">{{ genreTitle }}</span> 類型推薦
        <div class="h-px w-32 bg-indigo-500/30"></div>
      </h3>
      <button class="text-slate-500 hover:text-white text-sm font-bold">查看全部類型</button>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
      <div
        v-for="movie in movies"
        :key="movie.id"
        @click="$emit('selectMovie', movie)"
        class="group cursor-pointer"
      >
        <div
          class="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 group-hover:border-indigo-500/50 transition-all duration-500 shadow-xl group-hover:-translate-y-2"
        >
          <img
            :src="movie.poster"
            :alt="movie.title"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end"
          >
            <div class="text-[10px] font-black text-indigo-400 mb-1">IMDb {{ movie.rating }}</div>
            <div class="text-sm font-bold truncate">{{ movie.title }}</div>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-sm font-bold truncate text-slate-200 group-hover:text-indigo-400 transition-colors">
            {{ movie.title }}
          </div>
          <div class="text-xs text-slate-500 font-medium">{{ movie.year }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
