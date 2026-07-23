<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Lizer</h1>
      <h2>Login</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input 
            v-model="email" 
            type="email" 
            placeholder="E-mail"
            required
          />
        </div>
        
        <div class="password-container form-group">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password" 
            placeholder="Senha"
            required
          />
          <button @click="togglePassword" type="button" class="toggle-password">
            <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>
        
        <button type="submit" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
        
        
        <p class="register-link">
          Não tem conta? 
          <router-link to="/register">Registre-se</router-link>
        </p>
      </form>
    </div>

    <button class="btn-toggle-dark" @click="toggleDark()">
      <i :class="isDark ? 'pi pi-moon' : 'pi pi-sun'"></i>
    </button>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useDark, useToggle } from '@vueuse/core';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const showPassword = ref(false);

const isDark = useDark();
const toggleDark = useToggle(isDark);


const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  const result = await authStore.login({
    email: email.value,
    password: password.value
  })
  
  if (result.success) {
    router.push('/dashboard')
  } 
  else 
  {
    toast.error(`Email ou senha inválidos `, {
      position: "top-right",
      autoClose: 3000,
      theme: isDark.value ? 'dark' : 'light'
      });
    error.value = result.message
  }
  
  loading.value = false
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  background-image: url('@/images/login-waves-haikei.svg');
  background-position: center;
  /* background-repeat: no-repeat; */
  background-size: 100% auto;
  background-attachment: fixed;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #42b883;
  margin-bottom: 0.5rem;
  font-size: 50px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #33a06f;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}

.register-link {
  text-align: center;
  margin-top: 1rem;
}

.register-link a {
  color: #42b883;
  text-decoration: none;
}

.btn-toggle-dark {
  background: #256d4ba3;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  color: #42b883;
  position: absolute;
  top: 20px;
  left: 20px;
}

.btn-toggle-dark:hover
{
  background-color: #1f1f36de;
}

.password-container 
{
  display: flex;
  align-items: center;
  position: relative;
}

.toggle-password
{
  width: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 7px;
  padding: 6px 13px;
  background: none;
  position: absolute;
  right: 15px;
  background-color: transparent !important;
  color: #42b883;
}

</style>