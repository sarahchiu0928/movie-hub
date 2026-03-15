import { ref, watch } from 'vue'
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from './useAuth'

export interface WatchlistMovie {
  id: number
  title: string
  poster: string
  year: string
  rating: number
}

// 模組層級共享狀態，避免多個元件重複建立 Firestore 監聽
const { user } = useAuth()
const watchlist = ref<WatchlistMovie[]>([])
let unsubscribe: (() => void) | null = null

// 使用者登入/登出時，自動切換 Firestore 即時監聽
watch(user, (u) => {
  unsubscribe?.()
  if (u) {
    unsubscribe = onSnapshot(
      collection(db, 'users', u.uid, 'watchlist'),
      (snap) => {
        watchlist.value = snap.docs.map(d => d.data() as WatchlistMovie)
      }
    )
  } else {
    watchlist.value = []
    unsubscribe = null
  }
}, { immediate: true })

export function useWatchlist() {
  const isInWatchlist = (movieId: number) =>
    watchlist.value.some(m => m.id === movieId)

  const toggleWatchlist = async (movie: WatchlistMovie) => {
    if (!user.value) return
    const docRef = doc(db, 'users', user.value.uid, 'watchlist', String(movie.id))
    if (isInWatchlist(movie.id)) {
      await deleteDoc(docRef)
    } else {
      await setDoc(docRef, movie)
    }
  }

  return { watchlist, isInWatchlist, toggleWatchlist }
}
