<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGetTrendingMovies } from '../api/useGetTrendingMovies'
import { useGetMovieGenres } from '../api/useMovieGenres'
import { useGetMovieDetail } from '../api/useGetMovieDetail'
import type { Movie } from '../types/movies'
import { IMAGE_BASE_URL } from '../constants/baseUrl'
import { genreTranslations } from '../constants/genreTranslations'
import HeroSection from '../components/HeroSection.vue'
import GenreFilter from '../components/GenreFilter.vue'
import MovieGrid from '../components/MovieGrid.vue'

const router = useRouter()

const { data: genreData } = useGetMovieGenres()

// 類型
const genres = computed(() => {
  const genreNames = (genreData.value?.genres ?? []).map((g) => genreTranslations[g.name] || g.name)
  return ['全部', ...genreNames]
})

// 建立繁體名稱和類型 ID 的對應
const genreIdMap = computed(() => {
  const map: Record<string, number> = {}
  genreData.value?.genres?.forEach((g) => {
    const traditionalName = genreTranslations[g.name] || g.name
    map[traditionalName] = g.id
  })
  return map
})

// 格式化時長
const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

// 建立類型 ID 和繁體名稱的對應（用於反向查詢）
const genreIdToNameMap = computed(() => {
  const map: Record<number, string> = {}
  genreData.value?.genres?.forEach((g) => {
    const traditionalName = genreTranslations[g.name] || g.name
    map[g.id] = traditionalName
  })
  return map
})

const { data: trendingData } = useGetTrendingMovies()

const allMovies = computed<Movie[]>(() =>
  (trendingData.value?.results ?? []).map(
    (m): Movie => ({
      id: m.id,
      title: m.title || m.name || '',
      rating: Math.round(m.vote_average * 10) / 10,
      year: m.release_date?.slice(0, 4) || m.first_air_date?.slice(0, 4) || '2024',
      duration: m.runtime ? formatDuration(m.runtime) : '未知',
      genre:
        (m.genre_ids ?? [])
          .map((id) => genreIdToNameMap.value[id])
          .filter(Boolean)
          .join(' / ') || '未分類',
      backdrop: m.backdrop_path ? `${IMAGE_BASE_URL}/w1280${m.backdrop_path}` : '',
      poster: m.poster_path ? `${IMAGE_BASE_URL}/w500${m.poster_path}` : '',
      description: m.overview || '暫無簡介',
      cast: [],
      genreIds: m.genre_ids,
    })
  )
)
console.log(allMovies.value)

const activeGenre = ref('全部')
const featuredMovie = ref<Movie | null>(null)

const featuredMovieId = computed(() => (featuredMovie.value?.id ? String(featuredMovie.value.id) : ''))

const { data: rawFeaturedMovie } = useGetMovieDetail(featuredMovieId)

const displayFeaturedMovie = computed<Movie | null>(() => {
  if (!featuredMovie.value || !rawFeaturedMovie.value) return featuredMovie.value

  return {
    ...featuredMovie.value,
    duration: rawFeaturedMovie.value.runtime
      ? formatDuration(rawFeaturedMovie.value.runtime)
      : featuredMovie.value.duration,
    description: rawFeaturedMovie.value.overview || featuredMovie.value.description,
  }
})

// 根據選中的類型篩選電影
const movies = computed<Movie[]>(() => {
  if (activeGenre.value === '全部') {
    return allMovies.value
  }

  const selectedGenreId = genreIdMap.value[activeGenre.value]
  if (!selectedGenreId) {
    return allMovies.value
  }

  return allMovies.value.filter((movie) => movie.genreIds?.includes(selectedGenreId))
})

watch(
  allMovies,
  (val) => {
    if (val.length && !featuredMovie.value) {
      featuredMovie.value = val[0] ?? null
    }
  },
  { immediate: true }
)

const goToDetail = (movie: Movie) => {
  router.push({ name: 'movie-detail', params: { id: movie.id } })
}
</script>

<template>
  <div class="w-full">
    <HeroSection
      v-if="displayFeaturedMovie"
      :movie="displayFeaturedMovie"
      @view-detail="goToDetail(displayFeaturedMovie!)"
    />
    <main class="px-6 md:px-12 -mt-16 relative z-10 pb-20">
      <GenreFilter :genres="genres" v-model="activeGenre" />
      <div class="space-y-12">
        <MovieGrid :movies="movies" @select-movie="goToDetail" />
      </div>
    </main>
  </div>
</template>
