<template>
  <div class="space-y-2">
    <h3 class="text-xl font-semibold">Details</h3>
    <div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
      <div class="rounded-box border border-base-300 p-3">
        <div class="text-xs opacity-70">BPM</div>
        <div class="font-semibold">{{ good?.bpm || 0 }}</div>
      </div>
      <div class="rounded-box border border-base-300 p-3">
        <div class="text-xs opacity-70">Musical key</div>
        <div class="font-semibold">{{ good?.musicalKey || '-' }}</div>
      </div>
      <div class="rounded-box border border-base-300 p-3">
        <div class="text-xs opacity-70">Genre</div>
        <div class="font-semibold">{{ good?.genre || '-' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useGoods } from '../../composables/useGoods.js'

const route = useRoute()
const { getById } = useGoods()

const good = computed(() => getById(route.params.id))
</script>

