<template>
  <div class="space-y-4">
    <h3 class="text-xl font-semibold">Goods</h3>

    <div v-if="goods.length === 0" class="text-center py-12 text-base-content/60">
      <p class="text-base">No goods yet.</p>
      <router-link to="/admin/goods/add" class="btn btn-primary btn-sm mt-4">Add first product</router-link>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="table table-zebra w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>BPM</th>
            <th>Exclusive</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in goods" :key="item.id">
            <td class="font-medium">{{ item.title }}</td>
            <td><span class="badge badge-outline">{{ item.category }}</span></td>
            <td class="text-primary font-bold">${{ item.price.toFixed(2) }}</td>
            <td class="text-base-content/60">{{ item.bpm || '—' }}</td>
            <td>
              <span v-if="item.isExclusive" class="badge badge-primary">Yes</span>
              <span v-else class="text-base-content/40">—</span>
            </td>
            <td>
              <div class="flex gap-2">
                <router-link
                  :to="{ name: 'admin.goods.edit', params: { id: item.id } }"
                  class="btn btn-ghost btn-sm"
                >
                  Edit
                </router-link>
                <button class="btn btn-error btn-sm" @click="handleDelete(item)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useGoods } from '../../composables/useGoods.js'

const { goods, remove } = useGoods()

function handleDelete(item) {
  if (window.confirm(`Delete "${item.title}"?`)) {
    remove(item.id)
  }
}
</script>
