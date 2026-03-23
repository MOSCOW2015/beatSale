<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Admin</h2>
      <div class="flex gap-2">
        <router-link to="/admin/goods" class="btn btn-sm btn-outline">Goods list</router-link>
        <router-link to="/admin/goods/add" class="btn btn-sm btn-primary">Add</router-link>
      </div>
    </div>

    <div class="rounded-box border border-base-300 p-4">
      <router-view />
    </div>
  </div>
</template>

<script setup>
// Placeholder
</script>

