<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useSearchMovies } from '../api/useSearchMovies'
import { IMAGE_BASE_URL } from '../constants/baseUrl'
import { useAuth } from '../composables/useAuth'

defineProps<{
  scrolled: boolean
}>()

const { user, logout, loginWithGoogle } = useAuth()
const showUserMenu = ref(false)

const handleLogout = async () => {
  showUserMenu.value = false
  await logout()
}

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const isFocused = ref(false)

const { data: searchResults, isFetching } = useSearchMovies(searchQuery)

const showDropdown = computed(() => isFocused.value && searchQuery.value.trim().length > 0)

const handleEnter = () => {
  if (!searchQuery.value.trim()) return
  router.push({ name: 'search', query: { q: searchQuery.value.trim() } })
  isFocused.value = false
}

const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false
  }, 200)
}
</script>

<template>
  <nav
    :class="[
      'fixed top-0 w-full z-50 transition-all duration-500 flex items-center justify-between px-6 py-4',
      scrolled ? 'bg-slate-950/90 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-transparent',
    ]"
  >
    <div class="flex items-center gap-8">
      <RouterLink to="/" class="flex items-center gap-2 cursor-pointer group">
        <div class="w-10 h-10 bg-transparent rounded-lg flex items-center justify-center transition-colors">
          <img src="/movie.svg" alt="Movie" class="w-8 h-8" />
        </div>
        <h1
          class="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent"
        >
          MovieHub
        </h1>
      </RouterLink>

      <div class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <span v-if="route.name === 'movie-detail'" class="text-indigo-500 font-bold">詳情介紹</span>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="relative hidden sm:block">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors"
          :class="{ 'text-indigo-400': isFocused }"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜尋電影、演員..."
          class="bg-slate-900/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-slate-900 w-64 transition-all"
          @focus="isFocused = true"
          @blur="handleBlur"
          @keyup.enter="handleEnter"
        />
        <!-- 下拉搜尋結果 -->
        <div
          v-if="showDropdown"
          class="absolute top-full mt-2 right-0 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
        >
          <div v-if="isFetching" class="p-4 text-center text-slate-400 text-sm">搜尋中...</div>
          <template v-else-if="searchResults?.results?.length">
            <RouterLink
              v-for="movie in searchResults.results.slice(0, 6)"
              :key="movie.id"
              :to="{ name: 'movie-detail', params: { id: movie.id } }"
              class="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors"
              @click="
                () => {
                  searchQuery = ''
                  isFocused = false
                }
              "
            >
              <img
                v-if="movie.poster_path"
                :src="`${IMAGE_BASE_URL}/w92${movie.poster_path}`"
                :alt="movie.title"
                class="w-10 h-14 object-cover rounded-lg flex-shrink-0"
              />
              <div v-else class="w-10 h-14 bg-slate-800 rounded-lg flex-shrink-0" />
              <div class="min-w-0">
                <p class="text-sm font-semibold text-white truncate">{{ movie.title }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ movie.release_date?.slice(0, 4) }}</p>
              </div>
            </RouterLink>
            <button
              class="w-full px-4 py-3 text-sm text-indigo-400 hover:bg-slate-800 transition-colors text-center border-t border-white/10"
              @click="handleEnter"
            >
              查看「{{ searchQuery }}」全部結果
            </button>
          </template>
          <div v-else-if="searchResults" class="p-4 text-center text-slate-400 text-sm">找不到相關電影</div>
        </div>
      </div>
      <!-- 未登入：直接觸發 Google 登入 -->
      <button
        v-if="!user"
        @click="loginWithGoogle"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        登入
      </button>

      <!-- 已登入：顯示頭像與下拉選單 -->
      <div v-else class="relative">
        <button @click="showUserMenu = !showUserMenu" class="flex items-center gap-2 focus:outline-none">
          <img
            v-if="user.photoURL"
            :src="user.photoURL"
            :alt="user.displayName ?? 'User'"
            class="w-8 h-8 rounded-full border-2 border-white/20 hover:border-white transition-all object-cover"
          />
          <div
            v-else
            class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white/20 hover:border-white transition-all flex items-center justify-center text-xs font-bold"
          >
            {{ user.email?.[0]?.toUpperCase() }}
          </div>
        </button>

        <!-- 下拉選單 -->
        <div
          v-if="showUserMenu"
          class="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
        >
          <div class="px-4 py-3 border-b border-white/10">
            <p class="text-sm font-semibold text-white truncate">{{ user.displayName ?? user.email }}</p>
            <p v-if="user.displayName" class="text-xs text-slate-400 truncate mt-0.5">{{ user.email }}</p>
          </div>
          <RouterLink
            :to="{ name: 'watchlist' }"
            @click="showUserMenu = false"
            class="block w-full text-left px-4 py-3 text-sm text-white hover:bg-slate-800 transition-colors"
          >
            我的清單
          </RouterLink>
          <button
            @click="handleLogout"
            class="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-slate-800 transition-colors border-t border-white/10"
          >
            登出
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
