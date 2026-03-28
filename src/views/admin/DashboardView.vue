<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Admin</h2>
      <div class="flex gap-2">
        <router-link to="/admin/goods" class="btn btn-sm btn-outline">Goods list</router-link>
        <router-link to="/admin/goods/add" class="btn btn-sm btn-primary">Add</router-link>
      </div>
    </div>

    <div class="flex gap-4">
      <div class="card bg-base-200 shadow-md rounded-xl flex-1 p-4">
        <p class="text-sm text-base-content/60">Total goods</p>
        <p class="text-3xl font-bold text-primary">{{ goods.length }}</p>
      </div>
      <div class="card bg-base-200 shadow-md rounded-xl flex-1 p-4">
        <p class="text-sm text-base-content/60">Exclusive</p>
        <p class="text-3xl font-bold text-accent">{{ exclusiveCount }}</p>
      </div>
    </div>

    <div class="rounded-box border border-base-300 p-4">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGoods } from '../../composables/useGoods.js'

const { goods } = useGoods()
const exclusiveCount = computed(() => goods.value.filter((g) => g.isExclusive).length)
</script>
