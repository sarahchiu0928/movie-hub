<script setup lang="ts">
defineProps<{
  rating: number
}>()
</script>

<template>
  <span class="flex items-center gap-1 bg-white/10 px-2 py-1 rounded backdrop-blur-sm">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="text-yellow-400"
    >
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      />
    </svg>
    {{ rating }}
  </span>
</template>
