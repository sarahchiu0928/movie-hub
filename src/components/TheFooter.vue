<script setup lang="ts">
</script>

<template>
  <footer class="px-12 py-16 border-t border-white/5 bg-slate-950/50">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
      <div class="col-span-2 md:col-span-1 space-y-4">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="text-indigo-500">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          <span class="font-black text-xl tracking-tighter">CINEPULSE</span>
        </div>
        <p class="text-sm text-slate-500 leading-relaxed">
          您的終極影視探索指南。提供最新、最快、最完整的電影資訊。
        </p>
      </div>
      <div>
        <h5 class="font-bold mb-4 text-slate-200">連結</h5>
        <ul class="text-sm text-slate-500 space-y-2">
          <li class="hover:text-indigo-400 cursor-pointer transition-colors">隱私權政策</li>
          <li class="hover:text-indigo-400 cursor-pointer transition-colors">使用條款</li>
          <li class="hover:text-indigo-400 cursor-pointer transition-colors">廣告合作</li>
        </ul>
      </div>
      <div>
        <h5 class="font-bold mb-4 text-slate-200">社群</h5>
        <ul class="text-sm text-slate-500 space-y-2">
          <li class="hover:text-indigo-400 cursor-pointer transition-colors">Instagram</li>
          <li class="hover:text-indigo-400 cursor-pointer transition-colors">Twitter (X)</li>
          <li class="hover:text-indigo-400 cursor-pointer transition-colors">Facebook</li>
        </ul>
      </div>
      <div>
        <h5 class="font-bold mb-4 text-slate-200">版本資訊</h5>
        <p class="text-[10px] text-slate-600 font-mono">v2.4.0-stable | 2026.03</p>
      </div>
    </div>
  </footer>
</template>
