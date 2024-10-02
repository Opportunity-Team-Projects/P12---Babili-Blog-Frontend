import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'

/* axios.defaults.withCredentials = true;  // Aktiviert das Senden von Cookies bei Anfragen
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); */

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
