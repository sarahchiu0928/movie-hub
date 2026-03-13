// 類型篩選器
<script setup lang="ts">
defineProps<{
  genres: string[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex items-center gap-3 overflow-x-auto pb-8 no-scrollbar">
    <button v-for="genre in genres" :key="genre" @click="emit('update:modelValue', genre)" :class="[
      'px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border',
      modelValue === genre
        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
        : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
    ]">
      {{ genre }}
    </button>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
