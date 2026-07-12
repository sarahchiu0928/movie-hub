<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useGetTrendingMovies } from '../api/useGetTrendingMovies'
import { useGetMovieGenres } from '../api/useMovieGenres'
import { useGetMovieDetail } from '../api/useGetMovieDetail'
import type { Movie } from '../types/movies'
import { IMAGE_BASE_URL } from '../constants/baseUrl'
import { genreTranslations } from '../constants/genreTranslations'
import { formatDuration } from '../utils/formatDuration'
import HeroSection from '../components/HeroSection.vue'
import GenreFilter from '../components/GenreFilter.vue'
import MovieGrid from '../components/MovieGrid.vue'

const { data: genreData } = useGetMovieGenres()

// 類型
const genres = computed(() => {
  const genreNames = (genreData.value?.genres ?? []).map((g) => genreTranslations[g.name] || g.name)
  return ['全部', ...genreNames] // ['全部', '動作', '冒險', '劇情', '恐怖', ...]
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

// 建立類型 ID 和繁體名稱的對應（用於反向查詢）
const genreIdToNameMap = computed(() => {
  const map: Record<number, string> = {}
  genreData.value?.genres?.forEach((g) => {
    const traditionalName = genreTranslations[g.name] || g.name
    map[g.id] = traditionalName
  })
  return map
})

//這行在做「取得熱門電影清單」，而且是**無限捲動（infinite scroll）**版本
const { data: trendingData, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetTrendingMovies()

const toMovie = (m: any): Movie => ({
  id: m.id,
  title: m.title || m.name || '',
  rating: Math.round(m.vote_average * 10) / 10,
  year: m.release_date?.slice(0, 4) || m.first_air_date?.slice(0, 4) || '2024',
  duration: m.runtime ? formatDuration(m.runtime) : '未知',
  genre:
    (m.genre_ids ?? [])
      .map((id: number) => genreIdToNameMap.value[id])
      .filter(Boolean)
      .join(' / ') || '未分類',
  backdrop: m.backdrop_path ? `${IMAGE_BASE_URL}/w1280${m.backdrop_path}` : '',
  poster: m.poster_path ? `${IMAGE_BASE_URL}/w500${m.poster_path}` : '',
  description: m.overview || '暫無簡介',
  cast: [],
  genreIds: m.genre_ids,
})

//將多頁的熱門電影合併成一個陣列 (flatMap 把分頁展開，並把每頁的結果轉成 Movie)
const allMovies = computed<Movie[]>(() =>
  (trendingData.value?.pages ?? []).flatMap((page) => page.results.map(toMovie))
)

const activeGenre = ref('全部')
//當前顯示的主打電影（Hero Section 的電影）
const featuredMovie = ref<Movie | null>(null)

const featuredMovieId = computed(() => (featuredMovie.value?.id ? String(featuredMovie.value.id) : ''))

//透過 ID 取得主打電影的詳細資料
const { data: rawFeaturedMovie } = useGetMovieDetail(featuredMovieId)

//處理主打電影的詳細資料，例如時長和描述
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

//監視 allMovies 的變化，如果有新的電影加入，就更新 featuredMovie
watch(
  allMovies,
  (val) => {
    if (val.length && !featuredMovie.value) {
      featuredMovie.value = val[0] ?? null //取第一部熱門電影當主打
    }
  },
  { immediate: true } //立刻執行一次
)

// Infinite scroll — Intersection Observer 監聽哨兵元素
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      // entries[0]?.isIntersecting：判斷哨兵元素是否進入視窗
      // hasNextPage.value：判斷是否有更多頁面可以載入
      // !isFetchingNextPage.value：防止重複載入
      if (entries[0]?.isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
        fetchNextPage()
      }
    },
    { threshold: 0.1 } //當哨兵元素有 10% 的區域進入視窗時觸發
  )
  if (sentinel.value) observer.observe(sentinel.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="w-full">
    <HeroSection v-if="displayFeaturedMovie" :movie="displayFeaturedMovie" />
    <main class="px-6 md:px-12 -mt-16 relative z-10 pb-20">
      <GenreFilter :genres="genres" v-model:activeGenre="activeGenre" />
      <div class="space-y-12">
        <MovieGrid :movies="movies" />
      </div>

      <!-- 哨兵元素：進入視窗時觸發載入下一頁 -->
      <div ref="sentinel" class="h-10 flex items-center justify-center mt-6">
        <span v-if="isFetchingNextPage" class="text-slate-400 text-sm">載入中…</span>
        <span v-else-if="!hasNextPage && allMovies.length > 0" class="text-slate-600 text-sm">已顯示全部電影</span>
      </div>
    </main>
  </div>
</template>
