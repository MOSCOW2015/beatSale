<template>
  <div class="space-y-2">
    <h3 class="text-xl font-semibold">Seller</h3>
    <div class="rounded-box border border-base-300 p-4">
      <div class="text-xs opacity-70">Seller name</div>
      <div class="mt-1 text-lg font-semibold">{{ good?.seller || '-' }}</div>

      <div class="mt-3 text-sm opacity-70">
        Cat: {{ good?.category || '-' }}. Exclusive: {{ good?.isExclusive ? 'Yes' : 'No' }}.
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

