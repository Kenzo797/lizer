<template>
  <div class="dashboard">
    <header>
      <h1>Meus Links</h1>
      <div class="user-info">
        <span>Olá, {{ authStore.user?.name || 'Usuário' }}</span>
        <button @click="handleLogout">Sair</button>
      </div>
    </header>
    
    <div class="content">
      <p>Dashboard em construção...</p>
      <p>Em breve você poderá gerenciar seus links aqui!</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

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
}

.user-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

button {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #c82333;
}

.content {
  padding: 2rem;
  text-align: center;
}
</style>