import { ref, onMounted, onUnmounted } from 'vue'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth } from '../firebase'

const user = ref<User | null>(null)
const isLoading = ref(true)

let unsubscribe: (() => void) | null = null

export function useAuth() {
  onMounted(() => {
    unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      isLoading.value = false
    })
  })

  onUnmounted(() => {
    unsubscribe?.()
  })

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

  return { user, isLoading, loginWithGoogle, loginWithEmail, registerWithEmail, logout }
}
