<script setup lang="ts">
defineProps<{
  scrolled: boolean
  activeView: 'home' | 'detail'
  searchQuery: string
}>()

const emit = defineEmits<{
  'update:activeView': [value: 'home' | 'detail']
  'update:searchQuery': [value: string]
}>()
</script>

<template>
  <nav :class="[
    'fixed top-0 w-full z-50 transition-all duration-500 flex items-center justify-between px-6 py-4',
    scrolled ? 'bg-slate-950/90 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-transparent'
  ]">
    <div class="flex items-center gap-8">
      <div @click="emit('update:activeView', 'home')" class="flex items-center gap-2 cursor-pointer group">
        <div
          class="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        </div>
        <h1
          class="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          CINEPULSE</h1>
      </div>

      <div class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button @click="emit('update:activeView', 'home')"
          :class="[activeView === 'home' ? 'text-white underline underline-offset-8 decoration-indigo-500' : 'hover:text-white transition-colors']">首頁</button>
        <button @click="emit('update:activeView', 'detail')" v-if="activeView === 'detail'"
          class="text-indigo-500 font-bold">詳情介紹</button>
        <button v-if="activeView === 'home'" class="hover:text-white transition-colors">電影</button>
        <button class="hover:text-white transition-colors">影集</button>
        <button class="hover:text-white transition-colors">我的清單</button>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="relative group hidden sm:block">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input :value="searchQuery" @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)" type="text" placeholder="搜尋電影、演員..."
          class="bg-slate-900/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-slate-900 w-64 transition-all" />
      </div>
      <button class="p-2 text-slate-400 hover:text-white transition-colors relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950"></span>
      </button>
      <div
        class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 cursor-pointer border-2 border-white/20 hover:border-white transition-all">
      </div>
    </div>
  </nav>
</template>
