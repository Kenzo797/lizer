import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/dark.css'
import './styles/global.css'
import App from './App.vue'
import router from './router'

import 'primeicons/primeicons.css'
import 'vue3-toastify/dist/index.css';

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
