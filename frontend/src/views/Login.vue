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
        
        <div class="form-group">
          <input 
            v-model="password" 
            type="password" 
            placeholder="Senha"
            required
          />
        </div>
        
        <button type="submit" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
        
        <p v-if="error" class="error">{{ error }}</p>
        
        <p class="register-link">
          Não tem conta? 
          <router-link to="/register">Registre-se</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  const result = await authStore.login({
    email: email.value,
    password: password.value
  })
  
  if (result.success) {
    router.push('/dashboard')
  } else {
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
  background-repeat: no-repeat;
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
</style>