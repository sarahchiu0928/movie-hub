import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'
import SearchView from '../views/SearchView.vue'
import WatchlistView from '../views/WatchlistView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //根目錄（首頁）
    { path: '/', name: 'home', component: HomeView },
    //電影詳細頁面，:id 是動態參數
    { path: '/movie/:id', name: 'movie-detail', component: MovieDetailView },
    //搜尋結果頁面，?q=... 是可選的查詢參數（query parameter）
    { path: '/search', name: 'search', component: SearchView },
    //片單頁面
    { path: '/watchlist', name: 'watchlist', component: WatchlistView },
  ],
})

export default router
