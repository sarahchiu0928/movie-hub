<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGetMovieDetail } from '../api/useGetMovieDetail'
import type { Movie } from '../types/movies'
import { IMAGE_BASE_URL } from '../constants/baseUrl'
import MovieDetail from '../components/MovieDetail.vue'

const route = useRoute()
const router = useRouter()

const movieId = computed(() => String(route.params.id))

const { data: rawMovie } = useGetMovieDetail(movieId)

const movie = computed<Movie | null>(() => {
  const m = rawMovie.value
  if (!m) return null
  return {
    id: m.id,
    title: m.title || m.name || '',
    rating: Math.round(m.vote_average * 10) / 10,
    year: m.release_date?.slice(0, 4) || m.first_air_date?.slice(0, 4) || '2024',
    duration: '2h 15m',
    genre: '動作 / 科幻',
    backdrop: m.backdrop_path ? `${IMAGE_BASE_URL}/w1280${m.backdrop_path}` : '',
    poster: m.poster_path ? `${IMAGE_BASE_URL}/w500${m.poster_path}` : '',
    description: m.overview || '暫無簡介',
    cast: [],
  }
})

const goToDetail = (m: Movie) => {
  router.push({ name: 'movie-detail', params: { id: m.id } })
}
</script>

<template>
  <MovieDetail
    v-if="movie"
    :movie="movie"
    :similar-movies="[]"
    @back="router.push({ name: 'home' })"
    @select-movie="goToDetail"
  />
  <div v-else class="min-h-screen flex items-center justify-center text-slate-400">載入中...</div>
</template>
