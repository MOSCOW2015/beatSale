<template>
  <div class="space-y-4 max-w-lg">
    <h3 class="text-xl font-semibold">Add product</h3>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div class="form-control">
        <label class="label"><span class="label-text">Title <span class="text-error">*</span></span></label>
        <input v-model="form.title" type="text" class="input input-bordered w-full" :class="{ 'input-error': errors.title }" placeholder="Product title" />
        <span v-if="errors.title" class="text-error text-xs mt-1">{{ errors.title }}</span>
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Category</span></label>
        <select v-model="form.category" class="select select-bordered w-full">
          <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label"><span class="label-text">Price ($) <span class="text-error">*</span></span></label>
          <input v-model.number="form.price" type="number" min="0" step="0.01" class="input input-bordered w-full" :class="{ 'input-error': errors.price }" />
          <span v-if="errors.price" class="text-error text-xs mt-1">{{ errors.price }}</span>
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">BPM</span></label>
          <input v-model.number="form.bpm" type="number" min="0" class="input input-bordered w-full" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label"><span class="label-text">Musical key</span></label>
          <input v-model="form.musicalKey" type="text" class="input input-bordered w-full" placeholder="e.g. Am" />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">Genre</span></label>
          <input v-model="form.genre" type="text" class="input input-bordered w-full" placeholder="e.g. Hip-Hop" />
        </div>
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Seller</span></label>
        <input v-model="form.seller" type="text" class="input input-bordered w-full" placeholder="Seller name" />
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Image URL</span></label>
        <input v-model="form.image" type="text" class="input input-bordered w-full" placeholder="https://..." />
      </div>

      <div class="form-control">
        <label class="label"><span class="label-text">Description</span></label>
        <textarea v-model="form.description" class="textarea textarea-bordered w-full" rows="3" placeholder="Product description"></textarea>
      </div>

      <div class="form-control">
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="form.isExclusive" type="checkbox" class="checkbox checkbox-primary" />
          <span class="label-text">Exclusive</span>
        </label>
      </div>

      <div class="flex gap-3 pt-2">
        <button type="submit" class="btn btn-primary">Add product</button>
        <router-link :to="{ name: 'admin.goods' }" class="btn btn-ghost">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useGoods } from '../../composables/useGoods.js'

const CATEGORIES = ['Beat', 'Drum Kit', 'Loop Pack', 'Sample Pack', 'Melody Loop']

const router = useRouter()
const { create } = useGoods()

const form = reactive({
  title: '',
  category: CATEGORIES[0],
  price: 0,
  bpm: 0,
  musicalKey: '',
  genre: '',
  seller: '',
  image: '',
  description: '',
  isExclusive: false
})

const errors = reactive({ title: '', price: '' })

function validate() {
  errors.title = form.title.trim() ? '' : 'Title is required.'
  errors.price = form.price >= 0 ? '' : 'Price must be 0 or greater.'
  return !errors.title && !errors.price
}

function handleSubmit() {
  if (!validate()) return
  create({ ...form })
  router.push({ name: 'admin.goods' })
}
</script>
