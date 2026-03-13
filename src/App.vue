<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useGetTrendingMovies } from './api/useGetTrendingMovies'
import type { Movie } from './types/movies'
import { IMAGE_BASE_URL } from './constants/baseUrl'
import TheNavbar from './components/TheNavbar.vue'
import TheFooter from './components/TheFooter.vue'
import HeroSection from './components/HeroSection.vue'
import GenreFilter from './components/GenreFilter.vue'
import MovieGrid from './components/MovieGrid.vue'
import PremiumBanner from './components/PremiumBanner.vue'
import MovieDetail from './components/MovieDetail.vue'

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
const searchQuery = ref("")
const scrolled = ref(false)
const selectedMovie = ref<Movie | null>(null)
const activeView = ref<'home' | 'detail'>('home')

const similarMovies = computed(() => {
  if (!selectedMovie.value) return []
  const currentMainGenre = selectedMovie.value.genre.split(' / ')[0] || ""
  return movies.value.filter(m => m.id !== selectedMovie.value!.id && m.genre.includes(currentMainGenre)).slice(0, 5)
})

watch(movies, (val) => {
  if (val.length && !selectedMovie.value) {
    selectedMovie.value = val[0] ?? null
  }
})

const switchMovie = (movie: Movie) => {
  selectedMovie.value = movie
  activeView.value = 'detail'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => { scrolled.value = window.scrollY > 50 }
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
    <TheNavbar
      :scrolled="scrolled"
      :active-view="activeView"
      :search-query="searchQuery"
      @update:active-view="activeView = $event"
      @update:search-query="searchQuery = $event"
    />

    <transition name="page" mode="out-in">
      <MovieDetail
        v-if="activeView === 'detail' && selectedMovie"
        key="detail"
        :movie="selectedMovie"
        :similar-movies="similarMovies"
        @back="activeView = 'home'"
        @select-movie="switchMovie"
      />

      <div v-else key="home" class="w-full">
        <HeroSection
          v-if="selectedMovie"
          :movie="selectedMovie"
          @view-detail="activeView = 'detail'"
        />
        <main class="px-6 md:px-12 -mt-16 relative z-10 pb-20">
          <GenreFilter :genres="GENRES" v-model="activeGenre" />
          <div class="space-y-12">
            <MovieGrid :movies="movies" @select-movie="switchMovie" />
            <PremiumBanner :movies="movies" />
          </div>
        </main>
      </div>
    </transition>

    <TheFooter />
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
