<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth()

const isRegisterMode = ref(false)
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const handleGoogleLogin = async () => {
  try {
    errorMessage.value = ''
    await loginWithGoogle()
    router.push({ name: 'home' })
  } catch (e: any) {
    errorMessage.value = 'Google 登入失敗，請再試一次'
  }
}

const handleEmailSubmit = async () => {
  if (!email.value || !password.value) return
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    if (isRegisterMode.value) {
      await registerWithEmail(email.value, password.value)
    } else {
      await loginWithEmail(email.value, password.value)
    }
    router.push({ name: 'home' })
  } catch (e: any) {
    const codeMap: Record<string, string> = {
      'auth/user-not-found': '帳號不存在',
      'auth/wrong-password': '密碼錯誤',
      'auth/email-already-in-use': '此 Email 已被註冊',
      'auth/weak-password': '密碼至少需要 6 個字元',
      'auth/invalid-email': 'Email 格式不正確',
      'auth/invalid-credential': '帳號或密碼錯誤',
    }
    errorMessage.value = codeMap[e.code] ?? '發生錯誤，請再試一次'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 mb-4">
          <div class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
          <h1
            class="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            CINEPULSE
          </h1>
        </div>
        <p class="text-slate-400 text-sm">{{ isRegisterMode ? '建立你的帳號' : '登入以繼續' }}</p>
      </div>

      <!-- Card -->
      <div class="bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
        <!-- Google Login -->
        <button @click="handleGoogleLogin"
          class="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-semibold py-3 rounded-xl hover:bg-slate-100 transition-colors mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          使用 Google 登入
        </button>
      </div>
    </div>
  </div>
</template>
