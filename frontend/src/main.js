import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/dark.css'
import './styles/global.css'
import App from './App.vue'
import router from './router'

import 'primeicons/primeicons.css'
import 'vue3-toastify/dist/index.css';

// Limpa credenciais de versões antigas, que guardavam o token em localStorage
// (agora a sessão vive num cookie httpOnly, fora do alcance do JS)
localStorage.removeItem('token')
localStorage.removeItem('user')

const app = createApp(App)
const pinia = createPinia();

app.use(pinia)
app.use(router)

app.use(Vue3Toastify, {
    autoClose: 3000,          
    position: 'top-right',    
    pauseOnHover: true,       
    pauseOnFocusLoss: false,  
    theme: 'light',           
    newestOnTop: true,        
})

app.mount('#app')
