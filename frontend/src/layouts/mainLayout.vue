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
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-attachment: fixed;
}

/* .main-layout {
   background-image: url('@/images/layered-waves-haikei.svg');
  background-position: top;
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-attachment: fixed;
} */


.main-content {
  flex: 1;
  overflow: hidden;
}
</style>