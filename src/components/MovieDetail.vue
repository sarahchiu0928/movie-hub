<script setup lang="ts">
import type { Movie } from '../types/movies'
import { ref, computed } from 'vue'
import { useGetMovieTrailer } from '../api/useGetMovieTrailer'
import { useGetMovieCredits } from '../api/useGetmovieCredits'
import { useWatchlist } from '../composables/useWatchlist'
import { useAuth } from '../composables/useAuth'
import MovieBackdrop from './MovieDetail/MovieBackdrop.vue'
import BackButton from './MovieDetail/BackButton.vue'
import MoviePosterCard from './MovieDetail/MoviePosterCard.vue'
import MovieHeader from './MovieDetail/MovieHeader.vue'
import MoviePlot from './MovieDetail/MoviePlot.vue'
import CastList from './MovieDetail/CastList.vue'
import PlayButton from './MovieDetail/PlayButton.vue'
import SimilarMoviesSection from './MovieDetail/SimilarMoviesSection.vue'
import TrailerModal from './MovieDetail/TrailerModal.vue'

const props = defineProps<{
  movie: Movie
  similarMovies: Movie[]
}>()

const emit = defineEmits<{
  back: []
  selectMovie: [movie: Movie]
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

const movieId = ref(0)
const showTrailerModal = ref(false)
const { data: trailerData, isLoading: trailerLoading, error: trailerError } = useGetMovieTrailer(movieId)

const creditsMovieId = computed(() => String(props.movie.id))
const { data: creditsData } = useGetMovieCredits(creditsMovieId)

const handlePlayClick = () => {
  movieId.value = props.movie.id
  showTrailerModal.value = true
}

const primaryGenre = computed(() => {
  const genres = props.movie.genre?.split(' / ') ?? []
  return genres[0] || '未分類'
})

const trailerKey = computed(() => {
  const key = trailerData.value?.results?.[0]?.key
  return key || null
})
</script>

<template>
  <div class="relative min-h-screen pb-20 overflow-x-hidden">
    <!-- 背景層 -->
    <MovieBackdrop :backdrop-url="movie.backdrop || ''" />

    <!-- 內容主體區 -->
    <div class="relative z-10 pt-32 px-6 md:px-12 max-w-7xl mx-auto">
      <!-- 返回按鈕 -->
      <BackButton @click="emit('back')" />

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <!-- 左側：海報卡片 -->
        <MoviePosterCard :poster-url="movie.poster || ''" :title="movie.title" />

        <!-- 右側：電影核心資訊 -->
        <div class="lg:col-span-8 space-y-10">
          <!-- 電影標題和信息 -->
          <MovieHeader
            :title="movie.title"
            :year="movie.year"
            :duration="movie.duration || '未知'"
            :rating="movie.rating"
            :genre="movie.genre || '未分類'"
            :is-in-watchlist="isInWatchlist(movie.id)"
            :is-logged-in="!!user"
            @toggle-watchlist="handleToggle"
          />

          <!-- 劇情簡介 -->
          <MoviePlot :description="movie.description" />

          <!-- 演員名單 -->
          <CastList v-if="creditsData?.cast" :cast="creditsData.cast" />

          <!-- 播放按鈕 -->
          <PlayButton @play="handlePlayClick" />
        </div>
      </div>

      <!-- 相似電影推薦 -->
      <SimilarMoviesSection
        v-if="similarMovies.length > 0"
        :movies="similarMovies"
        :genre-title="primaryGenre"
        @select-movie="(m) => emit('selectMovie', m)"
      />
    </div>

    <!-- 預告片 Modal -->
    <TrailerModal
      :show="showTrailerModal"
      :is-loading="trailerLoading"
      :error="!!trailerError"
      :trailer-key="trailerKey"
      @close="showTrailerModal = false"
    />
  </div>
</template>
