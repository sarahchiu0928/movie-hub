<script setup lang="ts">
import { ref, computed } from 'vue'

interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
}

const props = defineProps<{
  cast: Cast[]
}>()

const showAllCast = ref(false)

const displayedCast = computed(() => {
  return showAllCast.value ? props.cast : props.cast.slice(0, 3)
})

const hasMoreCast = computed(() => props.cast.length > 3)
const moreCount = computed(() => props.cast.length - 3)
</script>

<template>
  <div class="space-y-6" v-if="cast && cast.length > 0">
    <h4 class="text-lg font-bold">主要卡司陣容</h4>
    <div class="flex flex-wrap gap-6">
      <div
        v-for="actor in displayedCast"
        :key="actor.id"
        class="flex items-center gap-3 group cursor-pointer"
      >
        <div
          class="w-14 h-14 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-indigo-500 transition-colors shadow-xl"
        >
          <img
            v-if="actor.profile_path"
            :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`"
            :alt="actor.name"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-slate-700 flex items-center justify-center text-slate-400 text-xs"
          >
            {{ actor.name[0] }}
          </div>
        </div>
        <div>
          <div class="text-sm font-bold text-white group-hover:text-indigo-400">{{ actor.name }}</div>
          <div class="text-[10px] text-slate-500 font-medium uppercase">{{ actor.character }}</div>
        </div>
      </div>
    </div>
    <button
      v-if="hasMoreCast"
      @click="showAllCast = !showAllCast"
      class="text-sm text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
    >
      {{ showAllCast ? '收起' : `查看更多 +${moreCount} 位演員` }}
    </button>
  </div>
</template>
