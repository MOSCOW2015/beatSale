<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div class="space-y-1">
        <h2 class="text-2xl font-bold">Goods</h2>
        <p class="opacity-70">Поиск, категории и диапазон BPM.</p>
      </div>
    </div>

    <div class="card bg-base-100 shadow-sm">
      <div class="card-body">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div class="space-y-2">
            <label class="label p-0">
              <span class="label-text">Search</span>
            </label>
            <input
              v-model.trim="search"
              type="text"
              class="input input-bordered w-full"
              placeholder="Find by title..."
            />
          </div>

          <div class="space-y-2">
            <label class="label p-0">
              <span class="label-text">Category</span>
            </label>
            <select v-model="selectedCategory" class="select select-bordered w-full">
              <option value="">All</option>
              <option v-for="c in categories" :key="c" :value="c">
                {{ c }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="label p-0">
              <span class="label-text">BPM range</span>
            </label>
            <div class="flex gap-2">
              <input
                v-model.number="bpmMin"
                type="number"
                class="input input-bordered w-1/2"
                placeholder="Min"
                min="0"
              />
              <input
                v-model.number="bpmMax"
                type="number"
                class="input input-bordered w-1/2"
                placeholder="Max"
                min="0"
              />
            </div>
            <div class="text-xs opacity-70">Оставьте пустым, если не нужно ограничивать.</div>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
          <button class="btn btn-sm btn-ghost" @click="resetFilters">Reset filters</button>
          <router-link to="/cart" class="btn btn-sm btn-secondary">Cart</router-link>
        </div>
      </div>
    </div>

    <div v-if="filteredGoods.length === 0" class="rounded-box border border-base-300 p-6 text-center">
      <div class="text-lg font-semibold">No goods found</div>
      <div class="opacity-70 mt-1">Попробуйте изменить фильтры.</div>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="g in filteredGoods" :key="g.id" class="card bg-base-100 shadow-sm">
        <figure class="relative">
          <img :src="g.image" :alt="g.title" class="h-48 w-full object-cover" />
          <div class="absolute left-2 top-2">
            <span v-if="g.isExclusive" class="badge badge-warning">Exclusive</span>
            <span v-else class="badge badge-ghost">Beat</span>
          </div>
        </figure>
        <div class="card-body">
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <h3 class="card-title text-base">{{ g.title }}</h3>
              <div class="flex flex-wrap gap-2">
                <span class="badge badge-outline">{{ g.category }}</span>
                <span v-if="g.bpm > 0" class="badge badge-outline">BPM {{ g.bpm }}</span>
                <span v-if="g.musicalKey" class="badge badge-outline">{{ g.musicalKey }}</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm opacity-70">Price</div>
              <div class="font-semibold">${{ g.price }}</div>
            </div>
          </div>

          <div class="card-actions justify-end">
            <router-link :to="`/goods/${g.id}/overview`" class="btn btn-primary btn-sm">
              View
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useGoods } from '../composables/useGoods.js'

const { list } = useGoods()

const categories = ['Beat', 'Drum Kit', 'Loop Pack', 'Sample Pack', 'Melody Loop']

const search = ref('')
const selectedCategory = ref('')
const bpmMin = ref(null)
const bpmMax = ref(null)

const goods = computed(() => list())

const filteredGoods = computed(() => {
  const q = search.value.trim().toLowerCase()

  const min = bpmMin.value === null || Number.isNaN(bpmMin.value) ? null : Number(bpmMin.value)
  const max = bpmMax.value === null || Number.isNaN(bpmMax.value) ? null : Number(bpmMax.value)

  return goods.value.filter((g) => {
    if (q && !String(g.title).toLowerCase().includes(q)) return false
    if (selectedCategory.value && g.category !== selectedCategory.value) return false

    if (min !== null && Number(g.bpm) < min) return false
    if (max !== null && Number(g.bpm) > max) return false

    return true
  })
})

function resetFilters() {
  search.value = ''
  selectedCategory.value = ''
  bpmMin.value = null
  bpmMax.value = null
}
</script>

