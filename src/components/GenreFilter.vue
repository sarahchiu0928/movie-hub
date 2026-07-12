<!-- 類型篩選器 -->
<script setup lang="ts">
import { computed, ref } from 'vue'

//props：接收父元件傳入的屬性， gồm genres（電影類型列表）和 activeGenre（當前選中的類型）
const props = defineProps<{
  genres: string[]
  activeGenre: string
}>()

const emit = defineEmits<{
  'update:activeGenre': [value: string]
}>()

const isExpanded = ref(false)

const visibleGenres = computed(() => {
  return isExpanded.value ? props.genres : props.genres.slice(0, 5)
})

const hasMore = computed(() => {
  return props.genres.length > 5
})
</script>

<template>
  <div class="flex flex-wrap gap-3 pb-8">
    <button
      v-for="genre in visibleGenres"
      :key="genre"
      @click="emit('update:activeGenre', genre)"
      :class="[
        'px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border',
        activeGenre === genre
          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
          : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20 hover:text-white',
      ]"
    >
      {{ genre }}
    </button>
    <button
      v-if="hasMore"
      @click="isExpanded = !isExpanded"
      :class="[
        'px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border',
        'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20 hover:text-white',
      ]"
    >
      {{ isExpanded ? '收起' : `更多類型 (+${props.genres.length - 5})` }}
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
