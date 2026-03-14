<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGetTrendingMovies } from '../api/useGetTrendingMovies'
import type { Movie } from '../types/movies'
import { IMAGE_BASE_URL } from '../constants/baseUrl'
import HeroSection from '../components/HeroSection.vue'
import GenreFilter from '../components/GenreFilter.vue'
import MovieGrid from '../components/MovieGrid.vue'
import PremiumBanner from '../components/PremiumBanner.vue'

const router = useRouter()

const GENRES = ["全部", "動作", "冒險", "科幻", "劇情", "恐怖", "動畫", "喜劇"]

const mockCast = [
  { name: "提摩西夏勒梅", role: "飾 主角", img: "https://i.pravatar.cc/150?u=a1" },
  { name: "千黛亞", role: "飾 角色A", img: "https://i.pravatar.cc/150?u=a2" },
  { name: "奧斯汀巴特勒", role: "飾 角色B", img: "https://i.pravatar.cc/150?u=a3" }
]

const { data: trendingData } = useGetTrendingMovies()

const movies = computed<Movie[]>(() =>
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
    cast: mockCast
  }))
)

const activeGenre = ref("全部")
const featuredMovie = ref<Movie | null>(null)

watch(movies, (val) => {
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
      <GenreFilter :genres="GENRES" v-model="activeGenre" />
      <div class="space-y-12">
        <MovieGrid :movies="movies" @select-movie="goToDetail" />
        <PremiumBanner :movies="movies" />
      </div>
    </main>
  </div>
</template>
