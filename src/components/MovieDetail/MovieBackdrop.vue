<script setup lang="ts">
defineProps<{
  backdropUrl: string
}>()
</script>

<template>
  <div class="absolute top-0 left-0 w-full h-[100vh] z-0 overflow-hidden">
    <img :src="backdropUrl" class="w-full h-full object-cover opacity-40 scale-105" />
    <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
    <div class="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-transparent"></div>
  </div>
</template>
