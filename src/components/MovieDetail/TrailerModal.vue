<script setup lang="ts">
defineProps<{
  show: boolean
  isLoading: boolean
  error: boolean
  trailerKey: string | null
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body" v-if="show">
    <div
      class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="$emit('close')"
    >
      <div class="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden">
        <!-- 關閉按鈕 -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- 加載狀態 -->
        <div v-if="isLoading" class="aspect-video bg-slate-800 flex items-center justify-center">
          <div class="text-slate-400">加載預告片中...</div>
        </div>

        <!-- 錯誤狀態 -->
        <div v-else-if="error" class="aspect-video bg-slate-800 flex items-center justify-center">
          <div class="text-slate-400">無法加載預告片</div>
        </div>

        <!-- 預告片視頻 -->
        <div v-else-if="trailerKey" class="aspect-video">
          <iframe
            :src="`https://www.youtube.com/embed/${trailerKey}`"
            title="電影預告片"
            class="w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>

        <!-- 沒有預告片 -->
        <div v-else class="aspect-video bg-slate-800 flex items-center justify-center text-slate-400">
          此電影沒有可用的預告片
        </div>
      </div>
    </div>
  </Teleport>
</template>
