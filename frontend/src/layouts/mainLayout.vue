<template>
  <div class="main-layout">
    <Sidebar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../components/sidebar.vue';
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  overflow: hidden;
}
</style>