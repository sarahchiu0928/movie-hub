<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGetMovieDetail } from '../api/useGetMovieDetail'
import { useGetTrendingMovies } from '../api/useGetTrendingMovies'
import type { Movie } from '../types/movies'
import { IMAGE_BASE_URL } from '../constants/baseUrl'
import MovieDetail from '../components/MovieDetail.vue'

const route = useRoute()
const router = useRouter()

const movieId = computed(() => String(route.params.id))

const mockCast = [
  { name: "提摩西夏勒梅", role: "飾 主角", img: "https://i.pravatar.cc/150?u=a1" },
  { name: "千黛亞", role: "飾 角色A", img: "https://i.pravatar.cc/150?u=a2" },
  { name: "奧斯汀巴特勒", role: "飾 角色B", img: "https://i.pravatar.cc/150?u=a3" }
]

const { data: rawMovie } = useGetMovieDetail(movieId)
const { data: trendingData } = useGetTrendingMovies()

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
    cast: mockCast
  }
})

const similarMovies = computed<Movie[]>(() => {
  if (!movie.value) return []
  return (trendingData.value?.results ?? [])
    .filter(m => m.id !== movie.value!.id)
    .slice(0, 5)
    .map((m): Movie => ({
      id: m.id,
      title: m.title || m.name || '',
      rating: Math.round(m.vote_average * 10) / 10,
      year: m.release_date?.slice(0, 4) || m.first_air_date?.slice(0, 4) || '2024',
      duration: '2h 15m',
      genre: '動作 / 科幻',
      backdrop: m.backdrop_path ? `${IMAGE_BASE_URL}/w1280${m.backdrop_path}` : '',
      poster: m.poster_path ? `${IMAGE_BASE_URL}/w500${m.poster_path}` : '',
      description: m.overview || '暫無簡介',
      cast: mockCast
    }))
})

const goToDetail = (m: Movie) => {
  router.push({ name: 'movie-detail', params: { id: m.id } })
}
</script>

<template>
  <MovieDetail
    v-if="movie"
    :movie="movie"
    :similar-movies="similarMovies"
    @back="router.push({ name: 'home' })"
    @select-movie="goToDetail"
  />
  <div v-else class="min-h-screen flex items-center justify-center text-slate-400">
    載入中...
  </div>
</template>
