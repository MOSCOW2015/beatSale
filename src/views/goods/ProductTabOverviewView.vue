<template>
  <div class="space-y-2">
    <h3 class="text-xl font-semibold">Overview</h3>
    <p class="opacity-80">{{ good?.description || 'No description.' }}</p>

    <div class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
      <div class="rounded-box border border-base-300 p-3">
        <div class="text-xs opacity-70">Category</div>
        <div class="font-semibold">{{ good?.category || '-' }}</div>
      </div>
      <div class="rounded-box border border-base-300 p-3">
        <div class="text-xs opacity-70">Seller</div>
        <div class="font-semibold">{{ good?.seller || '-' }}</div>
      </div>
      <div class="rounded-box border border-base-300 p-3">
        <div class="text-xs opacity-70">Exclusive</div>
        <div class="font-semibold">{{ good?.isExclusive ? 'Yes' : 'No' }}</div>
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

