<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useWatchlist } from '../composables/useWatchlist'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { user } = useAuth()
const { watchlist, toggleWatchlist } = useWatchlist()

const goToMovie = (id: number) => {
  router.push({ name: 'movie-detail', params: { id } })
}
</script>

<template>
  <div class="min-h-screen pt-28 px-6 md:px-12 pb-20">
    <div class="mb-8">
      <h2 class="text-3xl font-bold">我的清單</h2>
      <p class="text-slate-400 text-sm mt-2">{{ watchlist.length }} 部影片</p>
    </div>

    <!-- 未登入 -->
    <div v-if="!user" class="flex flex-col items-center justify-center py-32 text-slate-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.5" class="mb-4 opacity-30">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <p class="text-lg font-medium">請先登入</p>
      <p class="text-sm mt-2">登入後才能儲存喜愛的影片</p>
    </div>

    <!-- 清單為空 -->
    <div v-else-if="watchlist.length === 0" class="flex flex-col items-center justify-center py-32 text-slate-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.5" class="mb-4 opacity-30">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <p class="text-lg font-medium">清單是空的</p>
      <p class="text-sm mt-2">點擊影片上的愛心來加入清單</p>
    </div>

    <!-- 影片列表 -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
      <div v-for="movie in watchlist" :key="movie.id" class="group relative cursor-pointer"
        @click="goToMovie(movie.id)">
        <div
          class="aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-white/5 transition-all duration-300 group-hover:scale-105 group-hover:border-indigo-500/50">
          <img v-if="movie.poster" :src="movie.poster" :alt="movie.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
          <div v-else class="w-full h-full bg-slate-800" />
          <!-- 移除按鈕 -->
          <button
            class="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
            @click.stop="toggleWatchlist(movie)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="#f43f5e" stroke="#f43f5e" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
        <div class="mt-3 space-y-1">
          <h4 class="font-bold text-slate-100 truncate group-hover:text-indigo-400 transition-colors text-sm">
            {{ movie.title }}
          </h4>
          <div class="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{{ movie.year }}</span>
            <div class="flex items-center gap-1 text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                fill="currentColor" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {{ movie.rating }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
