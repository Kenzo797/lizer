<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>Lizer</h2>

      <div class="sidebar-subheader">
        <p>Organize Your Links</p>
        <button class="btn-toggle-dark" @click="toggleDark()">
          <i :class="isDark ? 'pi pi-moon' : 'pi pi-sun'"></i>
        </button>
      </div>
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
        <router-link to="/editprofile" class="btn-edit" title="Editar perfil">
          <i class="pi pi-pencil"></i>
        </router-link>
        <span class="user-name">{{ authStore.user?.name || 'Usuário' }}</span>
        <button @click="handleLogout" class="btn logout-btn">Sair</button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { userService } from '@/services/userService';
import { useDark, useToggle } from '@vueuse/core';


const isDark = useDark();
const toggleDark = useToggle(isDark);

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 53%;
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

.btn-edit {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #42b883;
  text-decoration: none;
}

.btn-edit:hover {
  background-color: rgba(66, 184, 131, 0.2);
}

.sidebar-subheader {
  display: flex;
  justify-content: space-between;
}

.btn-toggle-dark {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  color: #42b883;
}

.btn-toggle-dark:hover
{
  background-color: #1f1f36de;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    margin: 0;
    border-radius: 0;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    gap: 10px;
    z-index: 100;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0;
    border-bottom: none;
  }

  .sidebar-header h2 {
    font-size: 22px;
  }

  .sidebar-subheader p {
    display: none;
  }

  .sidebar-nav {
    flex: none;
    display: flex;
    flex-direction: row;
    padding: 0;
    gap: 6px;
  }

  .nav-item {
    padding: 8px 10px;
  }

  .nav-item .icon {
    margin-right: 0;
    display: flex;
    justify-content: center;
  }

  .nav-item .label {
    display: none;
  }

  .sidebar-footer {
    padding: 0;
    border-top: none;
  }

  .user-name {
    display: none;
  }

  .user-info
  {
    gap: 12px;
  }
}
</style>