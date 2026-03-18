<script setup lang="ts">
defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    @click="$emit('click')"
    class="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-all group"
  >
    <div
      class="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </div>
    <span class="font-bold text-sm">返回首頁</span>
  </button>
</template>
