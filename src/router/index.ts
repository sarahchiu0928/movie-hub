import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'
import HomeView from '../views/HomeView.vue'
import MovieDetailView from '../views/MovieDetailView.vue'
import SearchView from '../views/SearchView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/movie/:id', name: 'movie-detail', component: MovieDetailView },
    { path: '/search', name: 'search', component: SearchView },
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
  ]
})

router.beforeEach((to, _from, next) => {                                   
  const auth = getAuth()
  const user = auth.currentUser

  if (to.meta.guestOnly && user) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
