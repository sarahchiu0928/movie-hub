<script setup lang="ts">
defineProps<{
  description: string
}>()
</script>

<template>
  <div class="p-8 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 space-y-4">
    <h4 class="text-lg font-bold flex items-center gap-2">
      <span class="w-1 h-5 bg-indigo-500 rounded-full"></span>
      劇情故事
    </h4>
    <p class="text-slate-300 text-lg leading-relaxed font-light">
      {{ description }}
    </p>
  </div>
</template>
