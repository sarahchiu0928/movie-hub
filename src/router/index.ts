import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'
import SearchView from '../views/SearchView.vue'
import WatchlistView from '../views/WatchlistView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/movie-hub' },
    { path: '/movie-hub', name: 'home', component: HomeView },
    { path: '/movie/:id', name: 'movie-detail', component: MovieDetailView },
    { path: '/search', name: 'search', component: SearchView },
    { path: '/watchlist', name: 'watchlist', component: WatchlistView },
  ]
})

export default router
