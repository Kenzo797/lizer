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
  background-image: url('@/images/main-layout-waves-haikei.svg');
  background-position: center;
  /* background-position: bottom; */
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

body textarea:focus,body input:focus,body select:focus {
    outline: 0 !important;
}

.main-content {
  flex: 1;
  overflow: hidden;
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
}
</style>