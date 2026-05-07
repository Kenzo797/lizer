<template>
  <div class="edit-profile-container">
    <div class="edit-profile-card">
      <h1>Lizer</h1>
      <h2>Editar Perfil</h2>
      
      <form @submit.prevent="handleUpdate">
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
        
        <div class="form-group">
          <input 
            v-model="password" 
            type="password" 
            placeholder="Nova senha (opcional)"
          />
          <small class="password-hint">Deixe em branco para manter a senha atual</small>
        </div>
        
        <button type="submit" :disabled="loading">
          {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
        
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
        
        <p class="back-link">
          <router-link to="/dashboard">Voltar para o Dashboard</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { userService } from '../services/userService'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

// Carregar dados do usuário atual
onMounted(() => {
  name.value = authStore.user?.name || ''
  email.value = authStore.user?.email || ''
})

const handleUpdate = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    const updateData = {
      name: name.value,
      email: email.value
    }
    
    // Só inclui senha se foi preenchida
    if (password.value) {
      updateData.password = password.value
    }
    
    const response = await userService.update(authStore.user.id, updateData)
    
    // Atualizar dados no store
    authStore.user.name = updateData.name
    authStore.user.email = updateData.email
    localStorage.setItem('user', JSON.stringify(authStore.user))
    
    success.value = 'Perfil atualizado com sucesso!'
    
    // Limpar campo de senha
    password.value = ''
    
    // Opcional: redirecionar após 2 segundos
    // setTimeout(() => {
    //   router.push('/dashboard')
    // }, 2000)
    
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err)
    error.value = err.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.edit-profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  background-image: url('@/images/register-waves-haikei.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-attachment: fixed;
}

.edit-profile-card {
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

.password-hint {
  display: block;
  font-size: 11px;
  color: #888;
  margin-top: 4px;
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
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
}

.success {
  color: #42b883;
  margin-top: 1rem;
  text-align: center;
}

.back-link {
  text-align: center;
  margin-top: 1rem;
}

.back-link a {
  color: #42b883;
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>