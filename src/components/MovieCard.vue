<script setup lang="ts">
import type { Movie } from '../types/movies'
import { useWatchlist } from '../composables/useWatchlist'
import { useAuth } from '../composables/useAuth'
import RatingBadge from './RatingBadge.vue'

const props = defineProps<{
  movie: Movie
}>()

const emit = defineEmits<{
  select: []
}>()

const { user } = useAuth()
const { isInWatchlist, toggleWatchlist } = useWatchlist()

const handleToggle = (e: MouseEvent) => {
  e.stopPropagation()
  if (!user.value) return
  toggleWatchlist({
    id: props.movie.id,
    title: props.movie.title,
    poster: props.movie.poster,
    year: props.movie.year,
    rating: props.movie.rating,
  })
}
</script>

<template>
  <div class="group relative cursor-pointer" @click="emit('select')">
    <div
      class="aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-white/5 transition-all duration-300 group-hover:scale-105 group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/10">
      <img :src="movie.poster" :alt="movie.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy" />
      <!-- 愛心收藏按鈕 -->
      <button v-if="user"
        class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        @click="handleToggle">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          :fill="isInWatchlist(movie.id) ? '#f43f5e' : 'none'"
          :stroke="isInWatchlist(movie.id) ? '#f43f5e' : 'white'"
          stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
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
        <RatingBadge :rating="movie.rating" />
      </div>
    </div>
  </div>
</template>
