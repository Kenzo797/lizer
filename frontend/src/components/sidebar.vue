<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>Lizer</h2>
      <p>Organize Your Links</p>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item" :class="{ active: $route.name === 'Dashboard' }">
        <span class="icon">
          <i class="pi pi-list"></i>
        </span>
        <span class="label">Todos os links</span>
      </router-link>

      <router-link to="/categories" class="nav-item" :class="{ active: $route.name === 'Categories' }">
        <span class="icon">
          <i class="pi pi-folder-open"></i>
        </span>
        <span class="label">Categorias</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <span class="user-name">{{ authStore.user?.name || 'Usuário' }}</span>
        <button @click="handleLogout" class="logout-btn">Sair</button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.sidebar {
  width: 260px;
  background-color: #1a1a2e;
  color: #eee;
  display: flex;
  flex-direction: column;
  height: 95vh;
  position: sticky;
  top: 0;
  margin: 15px 0 15px 15px;
  border-radius: 15px;
  padding: 15px;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #2a2a3e;
}

.sidebar-header h2 {
  margin: 0;
  color: #42b883;
  font-size: 30px;
}

.sidebar-header p {
  margin: 8px 0 0;
  font-size: 12px;
  color: #888;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #eee;
  text-decoration: none;
  transition: background-color 0.2s;
  border-radius: 10px;
}

.nav-item:hover {
  background-color: #2a2a3e;
}

.nav-item.active {
  background-color: #42b883;
  color: white;
}

.nav-item .icon {
  width: 24px;
  margin-right: 12px;
  font-size: 18px;
}

.nav-item .label {
  font-size: 14px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #2a2a3e;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-name {
  font-size: 14px;
  color: #ccc;
}

.logout-btn {
  padding: 6px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.logout-btn:hover {
  background-color: #c82333;
}
</style>