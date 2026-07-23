<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Lizer</h1>
      <h2>Criar Conta</h2>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <input 
            v-model="name" 
            type="text" 
            placeholder="Nome"
            required
          />
        </div>
        
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
          {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
        </button>
        
        <p v-if="error" class="error">{{ error }}</p>
        
        <p class="login-link">
          Já tem conta? 
          <router-link to="/login">Faça login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useDark, useToggle } from '@vueuse/core';

const router = useRouter()
const authStore = useAuthStore()

const isDark = useDark();
const toggleDark = useToggle(isDark);

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  
  const result = await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value
  })

  if (result.success) 
  {
    if(result.data.token)
    {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      authStore.token = result.data.token;
      authStore.user = result.data.user;

      await new Promise(resolve => setTimeout(resolve, 10))

      router.push('/dashboard');
    }
    else
    {
      router.push('/login');
    }
  } 
  else 
  {
    if (result.message?.includes('já cadastrado'))
    {
      toast.error(`Email já cadastrado`, {
      position: "top-right",
      autoClose: 3000,
      theme: isDark.value ? 'dark' : 'light'
      });
    }
    else
    {
      toast.error(`Falha ao criar usuário`, {
      position: "top-right",
      autoClose: 3000,
      theme: isDark.value ? 'dark' : 'light'
      });
    }
  }
  
  loading.value = false
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
  background-image: url('@/images/register-waves-haikei.svg');
  background-position: center;
  /* background-repeat: no-repeat; */
  background-size: 100% auto;
  background-attachment: fixed;
}

.register-card {
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

.login-link {
  text-align: center;
  margin-top: 1rem;
}

.login-link a {
  color: #42b883;
  text-decoration: none;
}

.password-container {
  display: flex;
  align-items: center;
  position: relative;
}

.toggle-password {
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