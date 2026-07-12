import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../utils/firebase'

export interface WatchlistMovie {
  id: number
  title: string
  poster: string
  year: string
  rating: number
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(true)
  const watchlist = ref<WatchlistMovie[]>([])

  let unsubscribeWatchlist: (() => void) | null = null

  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser
    isLoading.value = false
  })

  // 登入/登出時，自動切換片單的 Firestore 即時監聽
  watch(
    user,
    (u) => {
      unsubscribeWatchlist?.()
      if (u) {
        unsubscribeWatchlist = onSnapshot(collection(db, 'users', u.uid, 'watchlist'), (snap) => {
          watchlist.value = snap.docs.map((d) => d.data() as WatchlistMovie)
        })
      } else {
        watchlist.value = []
        unsubscribeWatchlist = null
      }
    },
    { immediate: true }
  )

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const registerWithEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const isInWatchlist = (movieId: number) => watchlist.value.some((m) => m.id === movieId)

  const toggleWatchlist = async (movie: WatchlistMovie) => {
    if (!user.value) return
    const docRef = doc(db, 'users', user.value.uid, 'watchlist', String(movie.id))
    if (isInWatchlist(movie.id)) {
      await deleteDoc(docRef)
    } else {
      await setDoc(docRef, movie)
    }
  }

  return {
    user,
    isLoading,
    watchlist,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    isInWatchlist,
    toggleWatchlist,
  }
})
