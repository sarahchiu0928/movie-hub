<script setup lang="ts">
defineEmits<{
  play: []
}>()
</script>

<template>
  <div class="flex flex-wrap gap-4 pt-4">
    <button
      @click="$emit('play')"
      class="flex-1 min-w-[200px] flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-5 rounded-2xl font-black hover:bg-indigo-50 transition-all transform active:scale-95 shadow-2xl"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
      立即播放
    </button>
  </div>
</template>
