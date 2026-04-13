<template>
  <div class="dashboard">
    <header>
      <h1>Lizer</h1>
      <h3>Your Link Organizer</h3>
      <div class="user-info">
        <span>Olá, {{ authStore.user?.name || 'Usuário' }}</span>
        <button @click="handleLogout" class="btn-logout">Sair</button>
      </div>
    </header>
    
    <main>
      <LinkList />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LinkList from '../components/LinkList.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f5f5f5;
}

header {
  background-color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  color: #42b883;
  margin: 0;
}

.user-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-logout:hover {
  background-color: #c82333;
}

main {
  padding: 2rem;
}
</style>