<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGetTrendingMovies } from '../api/useGetTrendingMovies'
import { useGetMovieGenres } from '../api/useMovieGenres'
import type { Movie } from '../types/movies'
import { IMAGE_BASE_URL } from '../constants/baseUrl'
import HeroSection from '../components/HeroSection.vue'
import GenreFilter from '../components/GenreFilter.vue'
import MovieGrid from '../components/MovieGrid.vue'
import PremiumBanner from '../components/PremiumBanner.vue'

const router = useRouter()

// 簡體轉繁體翻譯表
const genreTranslations: Record<string, string> = {
  '动作': '動作',
  '冒险': '冒險',
  '动画': '動畫',
  '喜剧': '喜劇',
  '犯罪': '犯罪',
  '纪录': '紀錄',
  '剧情': '劇情',
  '家庭': '家庭',
  '奇幻': '奇幻',
  '历史': '歷史',
  '恐怖': '恐怖',
  '音乐': '音樂',
  '悬疑': '懸疑',
  '爱情': '愛情',
  '浪漫': '浪漫',
  '科幻': '科幻',
  '电视电影': '電視電影',
  '惊悚': '驚悚',
  '战争': '戰爭',
  '西部': '西部',
  '恐怖片': '恐怖片',
  '运动': '運動',
  '脱口秀': '脫口秀'
}

const { data: genreData } = useGetMovieGenres()

const genres = computed(() => {
  const genreNames = (genreData.value?.genres ?? []).map(g =>
    genreTranslations[g.name] || g.name
  )
  return ["全部", ...genreNames]
})

// 建立繁體名稱和類型 ID 的對應
const genreIdMap = computed(() => {
  const map: Record<string, number> = {}
  genreData.value?.genres?.forEach(g => {
    const traditionalName = genreTranslations[g.name] || g.name
    map[traditionalName] = g.id
  })
  return map
})

const mockCast = [
  { name: "提摩西夏勒梅", role: "飾 主角", img: "https://i.pravatar.cc/150?u=a1" },
  { name: "千黛亞", role: "飾 角色A", img: "https://i.pravatar.cc/150?u=a2" },
  { name: "奧斯汀巴特勒", role: "飾 角色B", img: "https://i.pravatar.cc/150?u=a3" }
]

const { data: trendingData } = useGetTrendingMovies()

const allMovies = computed<Movie[]>(() =>
  (trendingData.value?.results ?? []).map((m): Movie => ({
    id: m.id,
    title: m.title || m.name || '',
    rating: Math.round(m.vote_average * 10) / 10,
    year: m.release_date?.slice(0, 4) || m.first_air_date?.slice(0, 4) || '2024',
    duration: '2h 15m',
    genre: '動作 / 科幻',
    backdrop: m.backdrop_path ? `${IMAGE_BASE_URL}/w1280${m.backdrop_path}` : '',
    poster: m.poster_path ? `${IMAGE_BASE_URL}/w500${m.poster_path}` : '',
    description: m.overview || '暫無簡介',
    cast: mockCast,
    genreIds: m.genre_ids
  }))
)

const activeGenre = ref("全部")
const featuredMovie = ref<Movie | null>(null)

// 根據選中的類型篩選電影
const movies = computed<Movie[]>(() => {
  if (activeGenre.value === "全部") {
    return allMovies.value
  }

  const selectedGenreId = genreIdMap.value[activeGenre.value]
  if (!selectedGenreId) {
    return allMovies.value
  }

  return allMovies.value.filter(movie =>
    movie.genreIds?.includes(selectedGenreId)
  )
})

watch(allMovies, (val) => {
  if (val.length && !featuredMovie.value) {
    featuredMovie.value = val[0] ?? null
  }
}, { immediate: true })

const goToDetail = (movie: Movie) => {
  router.push({ name: 'movie-detail', params: { id: movie.id } })
}
</script>

<template>
  <div class="w-full">
    <HeroSection
      v-if="featuredMovie"
      :movie="featuredMovie"
      @view-detail="goToDetail(featuredMovie!)"
    />
    <main class="px-6 md:px-12 -mt-16 relative z-10 pb-20">
      <GenreFilter :genres="genres" v-model="activeGenre" />
      <div class="space-y-12">
        <MovieGrid :movies="movies" @select-movie="goToDetail" />
        <PremiumBanner :movies="movies" />
      </div>
    </main>
  </div>
</template>
