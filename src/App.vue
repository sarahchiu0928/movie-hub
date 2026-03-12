<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useGetTrendingMovies } from './api/useGetTrendingMovies'
import type { Movie } from './types/movies'
import { IMAGE_BASE_URL } from './constants/baseUrl'

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

const getSimilarMovies = () => {
  if (!selectedMovie.value || !movies.value) return []
  const currentMainGenre = selectedMovie.value.genre.split(' / ')[0] || ""
  return movies.value.filter(m => m.id !== selectedMovie.value!.id && m.genre.includes(currentMainGenre)).slice(0, 5)
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">

    <!-- 導航欄 Navbar -->
    <nav :class="[
      'fixed top-0 w-full z-50 transition-all duration-500 flex items-center justify-between px-6 py-4',
      scrolled ? 'bg-slate-950/90 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-transparent'
    ]">
      <div class="flex items-center gap-8">
        <div @click="activeView = 'home'" class="flex items-center gap-2 cursor-pointer group">
          <div
            class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <h1
            class="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            CINEPULSE</h1>
        </div>

        <div class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button @click="activeView = 'home'"
            :class="[activeView === 'home' ? 'text-white underline underline-offset-8 decoration-indigo-500' : 'hover:text-white transition-colors']">首頁</button>
          <button @click="activeView = 'detail'" v-if="activeView === 'detail'"
            class="text-indigo-500 font-bold">詳情介紹</button>
          <button v-if="activeView === 'home'" class="hover:text-white transition-colors">電影</button>
          <button class="hover:text-white transition-colors">影集</button>
          <button class="hover:text-white transition-colors">我的清單</button>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative group hidden sm:block">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="搜尋電影、演員..."
            class="bg-slate-900/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-slate-900 w-64 transition-all" />
        </div>
        <button class="p-2 text-slate-400 hover:text-white transition-colors relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950"></span>
        </button>
        <div
          class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 cursor-pointer border-2 border-white/20 hover:border-white transition-all">
        </div>
      </div>
    </nav>

    <transition name="page" mode="out-in">
      <div v-if="activeView === 'detail' && selectedMovie" key="detail"
        class="relative min-h-screen pb-20 overflow-x-hidden">
        <!-- 1. 沉浸式背景圖層 -->
        <div class="absolute top-0 left-0 w-full h-[100vh] z-0">
          <img :src="selectedMovie.backdrop" class="w-full h-full object-cover opacity-40 scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-transparent"></div>
        </div>

        <!-- 2. 內容主體區 -->
        <div class="relative z-10 pt-32 px-6 md:px-12 max-w-7xl mx-auto">
          <!-- 返回按鈕 -->
          <button @click="activeView = 'home'"
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
                <img :src="selectedMovie.poster"
                  class="relative w-full rounded-[2rem] shadow-2xl border border-white/10" />
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
                  <span
                    class="px-3 py-1 bg-indigo-600 rounded-md text-[10px] font-black tracking-tighter">PREMIUM</span>
                  <span class="text-slate-400 text-sm font-bold">{{ selectedMovie.year }} • {{ selectedMovie.duration
                    }}</span>
                </div>
                <h1 class="text-5xl md:text-8xl font-black tracking-tighter leading-none italic">{{ selectedMovie.title
                  }}</h1>
                <div class="flex flex-wrap items-center gap-6 pt-2">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="currentColor" class="text-yellow-500">
                        <polygon
                          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </div>
                    <div>
                      <div class="text-xl font-black leading-none">{{ selectedMovie.rating }}</div>
                      <div class="text-[9px] text-slate-500 font-black uppercase mt-1">IMDb Rating</div>
                    </div>
                  </div>
                  <div class="h-8 w-px bg-white/10"></div>
                  <div class="space-y-0.5">
                    <div class="text-lg font-bold text-slate-200">{{ selectedMovie.genre }}</div>
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
                  {{ selectedMovie.description }}
                </p>
              </div>

              <!-- 演員名單 -->
              <div class="space-y-6" v-if="selectedMovie.cast && selectedMovie.cast.length > 0">
                <h4 class="text-lg font-bold">主要卡司陣容</h4>
                <div class="flex flex-wrap gap-6">
                  <div v-for="actor in selectedMovie.cast" :key="actor.name"
                    class="flex items-center gap-3 group cursor-pointer">
                    <div
                      class="w-14 h-14 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-indigo-500 transition-colors shadow-xl">
                      <img :src="actor.img" class="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div class="text-sm font-bold text-white group-hover:text-indigo-400">{{ actor.name }}</div>
                      <div class="text-[10px] text-slate-500 font-medium uppercase">{{ actor.role }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 操作按鈕 -->
              <div class="flex flex-wrap gap-4 pt-4">
                <button
                  class="flex-1 min-w-[200px] flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-5 rounded-2xl font-black hover:bg-indigo-50 transition-all transform active:scale-95 shadow-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  立即播放
                </button>
                <button
                  class="px-8 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors font-bold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  加入清單
                </button>
              </div>
            </div>
          </div>

          <!-- 3. 底部推薦區 (根據類型篩選) -->
          <div class="mt-32 space-y-10">
            <div class="flex items-center justify-between">
              <h3 class="text-3xl font-black italic flex items-center gap-4">
                更多 <span class="text-indigo-500">{{ selectedMovie.genre.split(' / ')[0] }}</span> 類型推薦
                <div class="h-px w-32 bg-indigo-500/30"></div>
              </h3>
              <button class="text-slate-500 hover:text-white text-sm font-bold">查看全部類型</button>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              <div v-for="movie in getSimilarMovies()" :key="movie.id" @click="switchMovie(movie)"
                class="group cursor-pointer">
                <div
                  class="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 group-hover:border-indigo-500/50 transition-all duration-500 shadow-xl group-hover:-translate-y-2">
                  <img :src="movie.poster"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <div class="text-[10px] font-black text-indigo-400 mb-1">IMDb {{ movie.rating }}</div>
                    <div class="text-sm font-bold truncate">{{ movie.title }}</div>
                  </div>
                </div>
                <div class="mt-4">
                  <div class="text-sm font-bold truncate text-slate-200 group-hover:text-indigo-400 transition-colors">
                    {{ movie.title }}</div>
                  <div class="text-xs text-slate-500 font-medium">{{ movie.year }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else key="home" class="w-full">
        <!-- 主視覺區域 Hero Section -->

        <section v-if="selectedMovie" class="relative h-[85vh] w-full overflow-hidden">
          <!-- 背景大圖 -->
          <div class="absolute inset-0">
            <img :src="selectedMovie.backdrop" :alt="selectedMovie.title"
              class="w-full h-full object-cover animate-in fade-in zoom-in duration-1000" />
            <!-- 漸層遮罩 -->
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent"></div>
          </div>

          <div class="absolute bottom-24 left-6 md:left-12 max-w-2xl space-y-6">
            <div class="flex items-center gap-2 text-indigo-400 font-bold tracking-wider text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
              <span>今日熱門榜單第一名</span>
            </div>
            <h2 class="text-5xl md:text-7xl font-black leading-tight drop-shadow-2xl">
              {{ selectedMovie.title }}
            </h2>
            <div class="flex items-center gap-4 text-sm font-semibold text-slate-300">
              <span class="flex items-center gap-1 bg-white/10 px-2 py-1 rounded backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="text-yellow-400">
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {{ selectedMovie.rating }}
              </span>
              <span>{{ selectedMovie.year }}</span>
              <span>{{ selectedMovie.duration }}</span>
              <span class="border border-white/30 px-2 py-0.5 rounded text-[10px]">4K Ultra HD</span>
            </div>
            <p class="text-slate-300 text-lg leading-relaxed line-clamp-3">
              {{ selectedMovie.description }}
            </p>

            <div class="flex items-center gap-4 pt-4">
              <button
                class="flex items-center gap-2 bg-white text-slate-950 px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-50 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                立即播放
              </button>
              <button @click="activeView = 'detail'"
                class="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                更多資訊
              </button>
            </div>
          </div>
        </section>

        <!-- 主要內容區 -->
        <main class="px-6 md:px-12 -mt-16 relative z-10 pb-20">

          <!-- 分類篩選器 Filter Bar -->
          <div class="flex items-center gap-3 overflow-x-auto pb-8 no-scrollbar">
            <button v-for="genre in GENRES" :key="genre" @click="activeGenre = genre" :class="[
              'px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border',
              activeGenre === genre
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
            ]">
              {{ genre }}
            </button>
          </div>

          <!-- 電影網格 Movie Grid -->
          <div class="space-y-12">
            <section>
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="text-indigo-500">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  最近更新
                </h3>
                <a href="#"
                  class="text-slate-400 hover:text-white flex items-center gap-1 text-sm font-medium transition-colors">
                  查看全部
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </a>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                <div v-for="movie in movies" :key="movie.id" class="group relative cursor-pointer"
                  @click="switchMovie(movie)">
                  <div
                    class="aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-white/5 transition-all duration-300 group-hover:scale-105 group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/10">
                    <img :src="movie.poster" :alt="movie.title"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy" />
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
                      <div class="flex items-center gap-1 text-indigo-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                          fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round">
                          <polygon
                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        {{ movie.rating }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 橫向推薦 Banner (模擬廣告或特別專欄) -->
            <section
              class="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
              <div
                class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-indigo-500/20 transition-all duration-1000">
              </div>
              <div class="flex-1 space-y-4 relative z-10">
                <span class="bg-indigo-600 text-[10px] font-black tracking-widest px-2 py-1 rounded uppercase">Premium
                  Access</span>
                <h3 class="text-3xl font-black italic">IMAX 體驗：視覺震撼</h3>
                <p class="text-slate-300 max-w-md">訂閱高級會員,即可解鎖所有 IMAX 比例電影與高動態範圍 (HDR) 串流服務。</p>
                <button
                  class="bg-white text-slate-900 font-bold px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all">
                  了解更多
                </button>
              </div>
              <div class="flex-shrink-0 relative z-10">
                <div class="flex -space-x-4">
                  <div v-for="i in [1, 2, 3]" :key="i"
                    class="w-24 h-32 rounded-lg border-2 border-slate-950 overflow-hidden shadow-2xl transform rotate-3 even:rotate-[-3deg] translate-y-2 group-hover:translate-y-0 transition-transform">
                    <img :src="movies?.[i]?.poster" class="w-full h-full object-cover" alt="stack" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </transition>

    <!-- 底部資訊頁尾 -->
    <footer class="px-12 py-16 border-t border-white/5 bg-slate-950/50">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
        <div class="col-span-2 md:col-span-1 space-y-4">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="text-indigo-500">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
            <span class="font-black text-xl tracking-tighter">CINEPULSE</span>
          </div>
          <p class="text-sm text-slate-500 leading-relaxed">
            您的終極影視探索指南。提供最新、最快、最完整的電影資訊。
          </p>
        </div>
        <div>
          <h5 class="font-bold mb-4 text-slate-200">連結</h5>
          <ul class="text-sm text-slate-500 space-y-2">
            <li class="hover:text-indigo-400 cursor-pointer transition-colors">隱私權政策</li>
            <li class="hover:text-indigo-400 cursor-pointer transition-colors">使用條款</li>
            <li class="hover:text-indigo-400 cursor-pointer transition-colors">廣告合作</li>
          </ul>
        </div>
        <div>
          <h5 class="font-bold mb-4 text-slate-200">社群</h5>
          <ul class="text-sm text-slate-500 space-y-2">
            <li class="hover:text-indigo-400 cursor-pointer transition-colors">Instagram</li>
            <li class="hover:text-indigo-400 cursor-pointer transition-colors">Twitter (X)</li>
            <li class="hover:text-indigo-400 cursor-pointer transition-colors">Facebook</li>
          </ul>
        </div>
        <div>
          <h5 class="font-bold mb-4 text-slate-200">版本資訊</h5>
          <p class="text-[10px] text-slate-600 font-mono">v2.4.0-stable | 2026.03</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.custom-blur {
  backdrop-filter: blur(40px) saturate(150%);
  background-color: rgba(15, 23, 42, 0.6);
}

.page-enter-active,
.page-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
