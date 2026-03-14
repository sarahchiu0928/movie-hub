<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSearchMovies } from '../api/useSearchMovies'
import { IMAGE_BASE_URL } from '../constants/baseUrl'

const route = useRoute()
const router = useRouter()

const query = computed(() => (route.query.q as string) || '')

const { data, isFetching } = useSearchMovies(query)

const goToMovie = (id: number) => {
  router.push({ name: 'movie-detail', params: { id } })
}
</script>

<template>
  <div class="min-h-screen pt-28 px-6 md:px-12 pb-20">
    <div class="mb-8">
      <p class="text-slate-400 text-sm mb-1">搜尋結果</p>
      <h2 class="text-3xl font-bold">
        「<span class="text-indigo-400">{{ query }}</span>」
      </h2>
      <p v-if="data" class="text-slate-400 text-sm mt-2">共 {{ data.total_results }} 部</p>
    </div>

    <!-- Loading -->
    <div v-if="isFetching" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
      <div v-for="i in 10" :key="i" class="aspect-[2/3] rounded-2xl bg-slate-800 animate-pulse" />
    </div>

    <!-- 結果 -->
    <div v-else-if="data?.results?.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
      <div
        v-for="movie in data.results"
        :key="movie.id"
        class="group relative cursor-pointer"
        @click="goToMovie(movie.id)"
      >
        <div class="aspect-[2/3] rounded-2xl overflow-hidden bg-slate-900 shadow-xl border border-white/5 transition-all duration-300 group-hover:scale-105 group-hover:border-indigo-500/50">
          <img
            v-if="movie.poster_path"
            :src="`${IMAGE_BASE_URL}/w500${movie.poster_path}`"
            :alt="movie.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
          </div>
          <!-- Hover 遮罩 -->
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <button class="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mb-3 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" class="translate-x-0.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
          </div>
        </div>
        <div class="mt-3 space-y-1">
          <h4 class="font-bold text-slate-100 truncate group-hover:text-indigo-400 transition-colors text-sm">
            {{ movie.title }}
          </h4>
          <div class="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{{ movie.release_date?.slice(0, 4) }}</span>
            <div class="flex items-center gap-1 text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              {{ Math.round(movie.vote_average * 10) / 10 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 無結果 -->
    <div v-else class="flex flex-col items-center justify-center py-32 text-slate-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mb-4 opacity-30"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <p class="text-lg font-medium">找不到「{{ query }}」的相關電影</p>
      <p class="text-sm mt-2">試試其他關鍵字</p>
    </div>
  </div>
</template>
