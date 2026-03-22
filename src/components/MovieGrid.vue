<script setup lang="ts">
import type { Movie } from '../types/movies'
import MovieCard from './MovieCard.vue'

defineProps<{
  movies: Movie[]
}>()

const emit = defineEmits<{
  selectMovie: [movie: Movie]
}>()
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-2xl font-bold flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-500">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        最近更新
      </h3>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" @select="emit('selectMovie', movie)" />
    </div>
  </section>
</template>
