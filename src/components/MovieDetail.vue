<script setup lang="ts">
import type { Movie } from '../types/movies'
import { ref, computed } from 'vue'
import { useGetMovieTrailer } from '../api/useGetMovieTrailer'
import { useGetMovieCredits } from '../api/useGetmovieCredits'
import { useWatchlist } from '../composables/useWatchlist'
import { useAuth } from '../composables/useAuth'

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
const showAllCast = ref(false)

const handlePlayClick = () => {
  movieId.value = props.movie.id
  showTrailerModal.value = true
}
</script>

<template>
  <div class="relative min-h-screen pb-20 overflow-x-hidden">
    <!-- 1. 沉浸式背景圖層 -->
    <div class="absolute top-0 left-0 w-full h-[100vh] z-0 overflow-hidden">
      <img :src="movie.backdrop" class="w-full h-full object-cover opacity-40 scale-105" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-transparent"></div>
    </div>

    <!-- 2. 內容主體區 -->
    <div class="relative z-10 pt-32 px-6 md:px-12 max-w-7xl mx-auto">
      <!-- 返回按鈕 -->
      <button @click="emit('back')"
        class="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-all group">
        <div
          class="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </div>
        <span class="font-bold text-sm">返回首頁</span>
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <!-- 左側：海報卡片 -->
        <div class="lg:col-span-4 hidden lg:block">
          <div class="relative group">
            <div
              class="absolute -inset-4 bg-indigo-500/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity">
            </div>
            <img :src="movie.poster" class="relative w-full rounded-[2rem] shadow-2xl border border-white/10" />
            <div
              class="absolute bottom-6 left-6 right-6 p-4 custom-blur rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <div class="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Available in</div>
                <div class="text-sm font-bold">4K Ultra HD / HDR</div>
              </div>
              <div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- 右側：電影核心資訊 -->
        <div class="lg:col-span-8 space-y-10">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <span class="px-3 py-1 bg-indigo-600 rounded-md text-[10px] font-black tracking-tighter">PREMIUM</span>
              <span class="text-slate-400 text-sm font-bold">{{ movie.year }} • {{ movie.duration }}</span>
            </div>
            <!-- 標題 + 愛心收藏按鈕 -->
            <div class="flex items-center justify-between gap-4">
              <h1 class="text-5xl md:text-8xl font-black tracking-tighter leading-none italic">{{ movie.title }}</h1>
              <button v-if="user"
                class="w-12 h-12 rounded-full bg-black/50 border-2 border-white/0 hover:border-white/50 flex items-center justify-center hover:bg-black/70 transition-colors flex-shrink-0"
                @click="handleToggle">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                  :fill="isInWatchlist(movie.id) ? '#f43f5e' : 'none'"
                  :stroke="isInWatchlist(movie.id) ? '#f43f5e' : 'white'" stroke-width="2">
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
            <div class="flex flex-wrap items-center gap-6 pt-2">
              <div class="flex items-center gap-2">
                <div
                  class="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
                    class="text-yellow-500">
                    <polygon
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div>
                  <div class="text-xl font-black leading-none">{{ movie.rating }}</div>
                  <div class="text-[9px] text-slate-500 font-black uppercase mt-1">IMDb Rating</div>
                </div>
              </div>
              <div class="h-8 w-px bg-white/10"></div>
              <div class="space-y-0.5">
                <div class="text-lg font-bold text-slate-200">{{ movie.genre }}</div>
                <div class="text-[9px] text-slate-500 font-black uppercase">影片類型</div>
              </div>
            </div>
          </div>

          <!-- 簡介區塊 -->
          <div class="p-8 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 space-y-4">
            <h4 class="text-lg font-bold flex items-center gap-2">
              <span class="w-1 h-5 bg-indigo-500 rounded-full"></span>
              劇情故事
            </h4>
            <p class="text-slate-300 text-lg leading-relaxed font-light">
              {{ movie.description }}
            </p>
          </div>

          <!-- 演員名單 -->
          <div class="space-y-6" v-if="creditsData?.cast && creditsData.cast.length > 0">
            <h4 class="text-lg font-bold">主要卡司陣容</h4>
            <div class="flex flex-wrap gap-6">
              <div v-for="actor in (showAllCast ? creditsData.cast : creditsData.cast.slice(0, 3))" :key="actor.id" class="flex items-center gap-3 group cursor-pointer">
                <div
                  class="w-14 h-14 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-indigo-500 transition-colors shadow-xl">
                  <img
                    v-if="actor.profile_path"
                    :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`"
                    class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full bg-slate-700 flex items-center justify-center text-slate-400 text-xs">
                    {{ actor.name[0] }}
                  </div>
                </div>
                <div>
                  <div class="text-sm font-bold text-white group-hover:text-indigo-400">{{ actor.name }}</div>
                  <div class="text-[10px] text-slate-500 font-medium uppercase">{{ actor.character }}</div>
                </div>
              </div>
            </div>
            <button v-if="creditsData.cast.length > 3" @click="showAllCast = !showAllCast"
              class="text-sm text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
              {{ showAllCast ? '收起' : `查看更多 +${creditsData.cast.length - 3} 位演員` }}
            </button>
          </div>

          <!-- 操作按鈕 -->
          <div class="flex flex-wrap gap-4 pt-4">
            <button @click="handlePlayClick"
              class="flex-1 min-w-[200px] flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-5 rounded-2xl font-black hover:bg-indigo-50 transition-all transform active:scale-95 shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              立即播放
            </button>

          </div>
        </div>
      </div>

      <!-- 3. 底部推薦區 (根據類型篩選) -->
      <div class="mt-32 space-y-10">
        <div class="flex items-center justify-between">
          <h3 class="text-3xl font-black italic flex items-center gap-4">
            更多 <span class="text-indigo-500">{{ movie.genre.split(' / ')[0] }}</span> 類型推薦
            <div class="h-px w-32 bg-indigo-500/30"></div>
          </h3>
          <button class="text-slate-500 hover:text-white text-sm font-bold">查看全部類型</button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          <div v-for="similarMovie in similarMovies" :key="similarMovie.id" @click="emit('selectMovie', similarMovie)"
            class="group cursor-pointer">
            <div
              class="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 group-hover:border-indigo-500/50 transition-all duration-500 shadow-xl group-hover:-translate-y-2">
              <img :src="similarMovie.poster"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div
                class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <div class="text-[10px] font-black text-indigo-400 mb-1">IMDb {{ similarMovie.rating }}</div>
                <div class="text-sm font-bold truncate">{{ similarMovie.title }}</div>
              </div>
            </div>
            <div class="mt-4">
              <div class="text-sm font-bold truncate text-slate-200 group-hover:text-indigo-400 transition-colors">
                {{ similarMovie.title }}</div>
              <div class="text-xs text-slate-500 font-medium">{{ similarMovie.year }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 預告片 Modal -->
    <Teleport to="body" v-if="showTrailerModal">
      <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="showTrailerModal = false">
        <div class="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden">
          <!-- 關閉按鈕 -->
          <button @click="showTrailerModal = false"
            class="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- 加載狀態 -->
          <div v-if="trailerLoading" class="aspect-video bg-slate-800 flex items-center justify-center">
            <div class="text-slate-400">加載預告片中...</div>
          </div>

          <!-- 錯誤狀態 -->
          <div v-else-if="trailerError" class="aspect-video bg-slate-800 flex items-center justify-center">
            <div class="text-slate-400">無法加載預告片</div>
          </div>

          <!-- 預告片視頻 -->
          <div v-else-if="trailerData?.results && trailerData.results.length > 0" class="aspect-video">
            <iframe v-if="trailerData.results[0]" :src="`https://www.youtube.com/embed/${trailerData.results[0].key}`"
              title="Movie Trailer" class="w-full h-full" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
          </div>

          <!-- 沒有預告片 -->
          <div v-else class="aspect-video bg-slate-800 flex items-center justify-center text-slate-400">
            此電影沒有可用的預告片
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.custom-blur {
  backdrop-filter: blur(40px) saturate(150%);
  background-color: rgba(15, 23, 42, 0.6);
}
</style>
