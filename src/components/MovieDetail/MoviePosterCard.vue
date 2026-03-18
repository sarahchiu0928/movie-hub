<script setup lang="ts">
defineProps<{
  posterUrl: string
  title: string
}>()
</script>

<template>
  <div class="lg:col-span-4 hidden lg:block">
    <div class="relative group">
      <div
        class="absolute -inset-4 bg-indigo-500/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"
      ></div>
      <img :src="posterUrl" :alt="title" class="relative w-full rounded-[2rem] shadow-2xl border border-white/10" />
    </div>
  </div>
</template>

<style scoped>
.custom-blur {
  backdrop-filter: blur(40px) saturate(150%);
  background-color: rgba(15, 23, 42, 0.6);
}
</style>
