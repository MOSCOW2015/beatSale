<template>
  <div class="min-h-screen bg-base-200 flex flex-col">
    <Header />
    <main class="mx-auto w-full flex-1 max-w-6xl p-6">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

